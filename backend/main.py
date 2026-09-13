import os
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from cv_engine import preprocess_prescription_image
from parser import parse_prescription_with_gemini, parse_lab_report_with_gemini
from ddi_engine import evaluate_ddi_conflicts, resolve_salts
from fhir_exporter import generate_fhir_r4_bundle
from gnani_voice import synthesize_indic_speech, transcribe_indic_speech, is_gnani_configured, GNANI_LANG_MAP

app = FastAPI(
    title="BharatDoc Clinical Intelligence API",
    description="Engine for paper prescription OCR normalization, bounding box grounding, ABDM FHIR R4 exporting, DDI safety checks, and Indic Voice Engine.",
    version="1.1.0"
)


# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DDICheckRequest(BaseModel):
    new_medicines: List[Dict[str, Any]]
    existing_medications: Optional[List[Dict[str, Any]]] = []

class FHIRExportRequest(BaseModel):
    prescription_data: Dict[str, Any]
    lab_data: Optional[Dict[str, Any]] = None
    patient_id: Optional[str] = "ABHA-91-8827-1092-4401"

class ChatRequest(BaseModel):
    query: str
    prescription_data: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, str]]] = []

class TTSRequest(BaseModel):
    text: str
    lang: Optional[str] = "hi"
    gender: Optional[str] = "female"


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BharatDoc Clinical Intelligence Engine",
        "version": "1.0.0",
        "abdm_fhir_compatible": True
    }

@app.post("/api/process-prescription")
async def process_prescription(file: Optional[UploadFile] = File(None)):
    """
    Accepts uploaded prescription photo, runs OpenCV CLAHE & contrast normalization,
    extracts naturalWidth & naturalHeight, and calls Gemini Flash to extract bounding boxes & clinical data.
    """
    if file:
        content = await file.read()
    else:
        # Fallback empty or default image processing
        content = None

    if content:
        cv_result = preprocess_prescription_image(content)
        parsed_data = parse_prescription_with_gemini(cv_result["processed_b64"])
    else:
        # Zero setup sample dataset fallback
        cv_result = {
            "naturalWidth": 1000,
            "naturalHeight": 1250,
            "processed_b64": ""
        }
        parsed_data = parse_prescription_with_gemini("")

    # Run DDI engine on extracted medicines
    ddi_result = evaluate_ddi_conflicts(parsed_data.get("medicines", []))

    # Generate FHIR R4 Bundle
    fhir_bundle = generate_fhir_r4_bundle(parsed_data)

    return {
        "success": True,
        "image_metadata": {
            "naturalWidth": cv_result["naturalWidth"],
            "naturalHeight": cv_result["naturalHeight"],
            "processed_b64": cv_result["processed_b64"]
        },
        "prescription": parsed_data,
        "ddi_safety": ddi_result,
        "fhir_bundle": fhir_bundle
    }

@app.post("/api/process-multiple-prescriptions")
async def process_multiple_prescriptions(files: List[UploadFile] = File(...)):
    """
    Batch uploads multiple prescription photos (e.g. Cardiologist + Neurologist + Physician).
    Parses each slip in parallel and cross-checks active generic molecules across ALL slips for DDI safety.
    """
    prescriptions_list = []
    all_medicines = []

    for idx, file in enumerate(files):
        content = await file.read()
        cv_res = preprocess_prescription_image(content)
        parsed_p = parse_prescription_with_gemini(cv_res["processed_b64"])
        
        # Attach image metadata & ID
        parsed_p["id"] = f"presc-{idx + 1}"
        parsed_p["processed_b64"] = cv_res["processed_b64"]
        
        doc_name = parsed_p.get("doctor_name", f"Doctor #{idx + 1}")
        
        # Tag medicines with parent prescription reference
        meds = parsed_p.get("medicines", [])
        for m in meds:
            m["source_doctor"] = doc_name
            m["source_prescription"] = f"Prescription #{idx + 1}"
            all_medicines.append(m)

        prescriptions_list.append(parsed_p)

    # Evaluate combined DDI safety across all uploaded prescriptions
    ddi_result = evaluate_ddi_conflicts(all_medicines)

    return {
        "success": True,
        "prescriptions": prescriptions_list,
        "ddi_safety": ddi_result,
        "total_medicines": len(all_medicines)
    }

@app.post("/api/process-lab-report")
async def process_lab_report(file: Optional[UploadFile] = File(None)):
    """
    Parses lab report image/PDF for test parameters (HbA1c, Blood Sugar, Creatinine, Platelets, CBC)
    and converts diagnostic findings into ABDM-compliant HL7 FHIR R4 bundle.
    """
    if file:
        content = await file.read()
        cv_res = preprocess_prescription_image(content)
        parsed_lab = parse_lab_report_with_gemini(cv_res["processed_b64"])
    else:
        parsed_lab = parse_lab_report_with_gemini("")

    # Generate ABDM FHIR R4 bundle containing DiagnosticReport & Observation resources
    fhir_bundle = generate_fhir_r4_bundle(
        prescription_data={"patient_name": parsed_lab.get("patient_name"), "doctor_name": parsed_lab.get("lab_name")},
        lab_data=parsed_lab
    )

    return {
        "success": True,
        "lab_report": parsed_lab,
        "fhir_bundle": fhir_bundle
    }

@app.post("/api/ddi-check")
def ddi_check(req: DDICheckRequest):
    result = evaluate_ddi_conflicts(req.new_medicines, req.existing_medications)
    return result

@app.post("/api/fhir-export")
def fhir_export(req: FHIRExportRequest):
    bundle = generate_fhir_r4_bundle(
        prescription_data=req.prescription_data,
        lab_data=req.lab_data,
        patient_id=req.patient_id or "ABHA-91-8827-1092-4401"
    )
    return bundle

@app.post("/api/chat-grounded")
async def chat_grounded(req: ChatRequest):
    """
    Grounded clinical chatbot with strict out-of-domain guardrails.
    Answers prescription & medical questions accurately. Rejects non-medical/out-of-scope queries.
    """
    import requests, json
    query = (req.query or "").strip()
    if not query:
        return {"reply": "Please ask a question related to your prescription or medical guidance."}

    # Strict system prompt enforcing domain scope and medical accuracy
    system_prompt = f"""
You are BharatDoc Clinical Assistant, a compassionate clinical pharmacologist and medical companion for Indian healthcare patients.

ACTIVE PRESCRIPTION GROUNDING CONTEXT:
{json.dumps(req.prescription_data or {}, indent=2)}

STRICT GUARDRAIL & COMPLIANCE RULES:
1. OUT-OF-DOMAIN REJECTION: If the user asks non-medical, non-healthcare, or completely irrelevant questions (e.g. asking where a celebrity lives like Shah Rukh Khan, cricket/sports, movies, weather, coding, politics, jokes, non-medical trivia), you MUST politely DECLINE with this exact tone:
   "I am your BharatDoc Medical Assistant. I am specialized only in prescription analysis, medicine guidance, dietary precautions (Parhez), and healthcare support. Please ask questions related to your prescription or health."
2. MEDICAL & PRESCRIPTION SCOPE: Answer warmly, empathetically, and accurately based on medical pharmacology knowledge and active prescription details.
3. FORMATTING RULE (NO RAW PIPE TABLES): Do NOT output raw Markdown tables using pipe characters (|) or table separators (| :--- |). Instead, use clean bulleted lists, numbered sections, or bold key-value pairs for maximum readability on mobile and web screens.
4. DOSAGE SAFETY: Always remind the patient never to alter doctor-prescribed doses without consulting their prescribing physician.
"""

    api_key = os.getenv("GEMINI_API_KEY", "")
    models = ["gemini-3.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-pro-preview"]
    
    for m in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {
            "contents": [
                {"parts": [{"text": system_prompt + f"\n\nUser Question: {query}"}]}
            ],
            "generationConfig": {"temperature": 0.2}
        }
        try:
            res = requests.post(url, json=payload, timeout=15)
            if res.status_code == 200:
                reply = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                return {"reply": reply}
            else:
                print(f"[Chatbot HTTP {res.status_code} {m}]: {res.text[:150]}")
        except Exception as e:
            print(f"[Chatbot error {m}]: {e}")

    # Fallback local guardrail check if API is unreachable
    ql = query.lower()
    non_medical_keywords = ['shahrukh', 'shah rukh', 'khan', 'movie', 'ipl', 'cricket', 'song', 'joke', 'actor', 'house', 'president', 'modi', 'sports', 'game']
    if any(k in ql for k in non_medical_keywords):
        return {"reply": "I am your BharatDoc Medical Assistant. I am specialized only in prescription analysis, medicine guidance, dietary precautions (Parhez), and healthcare support. Please ask questions related to your prescription or health."}

    return {"reply": f"Based on your prescription document from {req.prescription_data.get('doctor_name', 'your doctor') if req.prescription_data else 'your scan'}, please follow the exact timing and dosage instructions listed on each pill card."}

@app.get("/api/voice/status")
def voice_status():
    """
    Returns Voice Engine configuration status and supported Indic languages.
    """
    return {
        "gnani_configured": is_gnani_configured(),
        "engine": "Indic Voice Engine",
        "supported_languages": list(GNANI_LANG_MAP.keys()),
        "fallback_engine": "Web Speech API"
    }


@app.post("/api/voice/tts")
async def voice_tts(req: TTSRequest):
    """
    Synthesizes Indic speech using Gnani.ai Vach TTS engine.
    """
    res = synthesize_indic_speech(text=req.text, lang=req.lang or "hi", gender=req.gender or "female")
    return res

@app.post("/api/voice/stt")
async def voice_stt(file: UploadFile = File(...), lang: Optional[str] = Form("hi")):
    """
    Transcribes Indic spoken audio into text using Gnani.ai Vach ASR engine.
    """
    content = await file.read()
    res = transcribe_indic_speech(audio_bytes=content, filename=file.filename or "audio.wav", lang=lang or "hi")
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

