# 🇮🇳 BharatDoc — Multi-Modal Clinical Intelligence Platform

**BharatDoc** is an AI-powered clinical intelligence platform designed for Indian healthcare. It transforms handwritten & printed paper prescriptions and diagnostic lab reports into machine-readable digital data, automatically detects poly-pharmacy drug-drug interactions (DDI), extracts longitudinal health trends, and exports official **HL7 FHIR R4 Bundles** ready for India's **ABHA (Ayushman Bharat Digital Mission)** ecosystem.

---

## 🚀 Quick Start Guide (How to Run the Project)

### 📋 Prerequisites
Ensure you have the following installed on your system:
- **Python 3.10+** (with `pip`)
- **Node.js 18+** (with `npm`)

---

## 🔑 1. Environment Configuration (`.env` Setup)

Since security best practices keep API keys out of source control, you need to create `.env` files in both the `backend/` and `frontend/` folders.

### A. Create `backend/.env`
Create a file named `.env` inside the `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### B. Create `frontend/.env`
Create a file named `.env` inside the `frontend/` directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## ⚙️ 2. Step-by-Step Running Commands

### 🐍 Step A: Start the FastAPI Backend (Terminal 1)

```bash
# 1. Navigate into the backend directory
cd backend

# 2. (Optional but recommended) Create a virtual environment
python -m venv venv

# Activate virtual environment:
# On Windows PowerShell:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server
python main.py
```
> 📍 Backend running live at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`)

---

### ⚛️ Step B: Start the React Frontend (Terminal 2)

```bash
# 1. Open a new terminal and navigate into the frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
> 📍 Web Application running live at: `http://localhost:5173`

---

## 🔥 Key Platform Capabilities

1. **Paper Prescription & PDF OCR Grounding**: Uses OpenCV CLAHE contrast enhancement + PyMuPDF + Google Gemini 2.0/3.5/3.7 Vision API to parse Indian prescriptions with 2D bounding boxes.
2. **Poly-Pharmacy Drug-Drug Interaction (DDI) Safety Radar**: Cross-analyzes multiple specialist prescriptions simultaneously to detect drug contraindications.
3. **Longitudinal Diagnostic Health Trends**: Aggregates multi-date lab slips (CBC, Fasting Blood Glucose, HbA1c, Serum Creatinine) into interactive Recharts time-series telemetry curves with reference range bands.
4. **ABDM HL7 FHIR R4 Bundle Exporter**: Automatically generates compliant FHIR R4 JSON schemas (`OPConsultation`, `MedicationRequest`, `DiagnosticReport`) ready for ABHA Digital Health Lockers.
5. **Multi-Lingual Vernacular Guidance**: Vernacular translations (Hindi, Tamil, Marathi, Bengali, English) for diet precautions (*Parhez*) and dosage timing.
6. **Bespoke Luxury Medical UI/UX**: Handcrafted design tokens, glowing risk status dots, and responsive mobile bottom-sheet AI assistant drawers.

---

## 📁 Repository Project Structure

```
BharatDoc/
├── backend/
│   ├── main.py              # FastAPI Web Server & Chatbot Endpoints
│   ├── parser.py            # Vision AI Prescription & Lab Extractor
│   ├── cv_engine.py          # CLAHE Image Preprocessing & PyMuPDF Engine
│   ├── ddi_engine.py        # Pharmacovigilance DDI Salt Conflict Resolver
│   ├── fhir_exporter.py     # HL7 FHIR R4 Bundle Generator
│   ├── requirements.txt     # Python Dependencies
│   └── data/                # Brand-Salt Mappings & DDI Interaction Rules
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    # Primary Medical Intelligence Workspace
│   │   │   ├── LandingPage.tsx  # Hero Presentation Page
│   │   │   └── AuthPage.tsx     # ABHA OTP Auth Page
│   │   ├── components/      # Tab Audit, DDI Radar, Lab Trends, FHIR Exporter
│   │   └── lib/             # Supabase Client & i18n Translations
│   ├── index.html           # HTML5 Entry point
│   └── package.json         # Node Dependencies
└── README.md
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
