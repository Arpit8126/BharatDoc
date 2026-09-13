import os
import uvicorn
import gradio as gr
from main import app as fastapi_app

# Create a clean monitoring / landing dashboard for the Hugging Face Space
with gr.Blocks(title="BharatDoc Clinical Intelligence API") as demo:
    gr.Markdown("# 🩺 BharatDoc Clinical Intelligence Backend API")
    gr.Markdown(
        "This Hugging Face Space hosts the **FastAPI Clinical Backend** powering BharatDoc.\n\n"
        "- **Prescription OCR & Coordinate Grounding** (`/api/process-prescription`)\n"
        "- **ABDM FHIR R4 Bundle Generator** (`/api/fhir-export`)\n"
        "- **Cross-Prescription DDI Matrix** (`/api/process-multiple-prescriptions`)\n"
        "- **Diagnostic Lab Report Engine** (`/api/process-lab-report`)\n"
        "- **Indic Voice Engine** (`/api/voice/tts` & `/api/voice/stt`)\n"
    )
    with gr.Row():
        gr.Textbox(
            label="System Status",
            value="🟢 Operational & Connected to BharatDoc on Vercel",
            interactive=False
        )

# Mount Gradio interface onto FastAPI app so all FastAPI /api/* routes are directly accessible
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
