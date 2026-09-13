---
title: BharatDoc Clinical Intelligence API
emoji: 🩺
colorFrom: green
colorTo: blue
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
---

# BharatDoc Clinical Intelligence API

FastAPI backend engine for:
- Paper prescription OCR normalization & bounding-box coordinate grounding
- ABDM FHIR R4 Bundle generation
- Multi-specialist Drug-Drug Interaction (DDI) safety matrix
- Diagnostic Lab Report bio-reference range extraction
- Vernacular Indic Voice Intelligence (TTS & STT proxy)

### Endpoints:
- `POST /api/process-prescription`
- `POST /api/process-multiple-prescriptions`
- `POST /api/process-lab-report`
- `POST /api/chat-grounded`
- `POST /api/ddi-check`
- `POST /api/fhir-export`
- `POST /api/voice/tts`
- `POST /api/voice/stt`
