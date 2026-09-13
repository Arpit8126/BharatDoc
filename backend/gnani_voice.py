"""
Gnani.ai (Vach) Indic Voice AI Engine Integration
Supports:
- High-fidelity Indic Text-to-Speech (TTS) across 14+ Indian languages
- Indic Speech-to-Text (STT / ASR) for patient voice queries and transcription
- Resilient fallback handling to browser Web Speech API
"""

import os
import base64
import logging
import requests
from typing import Dict, Any, Optional

logger = logging.getLogger("BharatDoc.GnaniVoice")
logger.setLevel(logging.INFO)

# Language code normalization for Gnani Vach Engine
GNANI_LANG_MAP = {
    "hi": "hi-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "kn": "kn-IN",
    "mr": "mr-IN",
    "bn": "bn-IN",
    "gu": "gu-IN",
    "ml": "ml-IN",
    "pa": "pa-IN",
    "or": "or-IN",
    "as": "as-IN",
    "ur": "ur-IN",
    "sa": "sa-IN",
    "en": "en-IN",
    "en-IN": "en-IN",
    "hi-IN": "hi-IN",
    "ta-IN": "ta-IN",
    "te-IN": "te-IN",
    "kn-IN": "kn-IN",
    "mr-IN": "mr-IN",
    "bn-IN": "bn-IN",
    "gu-IN": "gu-IN",
    "ml-IN": "ml-IN",
    "pa-IN": "pa-IN"
}

def get_gnani_api_key() -> str:
    return os.getenv("GNANI_API_KEY", "").strip()

def is_gnani_configured() -> bool:
    key = get_gnani_api_key()
    return bool(key and len(key) > 5)

def synthesize_indic_speech(text: str, lang: str = "hi", gender: str = "female") -> Dict[str, Any]:
    """
    Synthesizes speech using Gnani.ai / Vach TTS API.
    Returns base64 encoded audio string and content type.
    """
    if not text or not text.strip():
        return {"success": False, "error": "Empty text provided for synthesis", "fallback_to_browser": True}

    api_key = get_gnani_api_key()
    if not api_key:
        logger.warning("[Gnani TTS] GNANI_API_KEY not configured. Falling back to browser speech.")
        return {"success": False, "error": "GNANI_API_KEY not configured", "fallback_to_browser": True}

    gnani_lang = GNANI_LANG_MAP.get(lang.lower(), "hi-IN")
    
    # Candidate endpoints for Gnani Vach TTS API
    tts_endpoints = [
        "https://api.gnani.ai/vach/tts",
        "https://tts.gnani.ai/api/v1/tts",
        "https://asr-tts.gnani.ai/tts"
    ]

    headers = {
        "token": api_key,
        "Authorization": f"Bearer {api_key}",
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "lang": gnani_lang,
        "language": gnani_lang,
        "gender": gender,
        "audio_format": "wav",
        "speed": 1.0
    }

    for endpoint in tts_endpoints:
        try:
            logger.info(f"[Gnani TTS] Attempting synthesis via {endpoint} for lang={gnani_lang}...")
            resp = requests.post(endpoint, json=payload, headers=headers, timeout=12)
            
            if resp.status_code == 200:
                content_type = resp.headers.get("content-type", "")
                
                # Check if direct audio stream returned
                if "audio" in content_type or resp.content[:4] == b"RIFF" or resp.content[:3] == b"ID3" or resp.content[:2] == b"\xff\xfb":
                    audio_b64 = base64.b64encode(resp.content).decode("utf-8")
                    fmt = "audio/wav" if resp.content[:4] == b"RIFF" else "audio/mp3"
                    return {
                        "success": True,
                        "audio_base64": audio_b64,
                        "format": fmt,
                        "engine": "gnani_vach",
                        "lang": gnani_lang
                    }
                
                # Check if JSON with audio data returned
                try:
                    data = resp.json()
                    raw_audio = data.get("audioContent") or data.get("audio") or data.get("audio_data") or data.get("data")
                    if raw_audio:
                        return {
                            "success": True,
                            "audio_base64": raw_audio,
                            "format": data.get("format", "audio/wav"),
                            "engine": "gnani_vach",
                            "lang": gnani_lang
                        }
                    if "audio_url" in data:
                        return {
                            "success": True,
                            "audio_url": data["audio_url"],
                            "engine": "gnani_vach",
                            "lang": gnani_lang
                        }
                except Exception:
                    pass
            else:
                logger.warning(f"[Gnani TTS] {endpoint} returned status {resp.status_code}: {resp.text[:120]}")
        except Exception as e:
            logger.warning(f"[Gnani TTS] Connection to {endpoint} failed: {e}")

    return {
        "success": False,
        "error": "Gnani TTS service unavailable or response invalid",
        "fallback_to_browser": True
    }


def transcribe_indic_speech(audio_bytes: bytes, filename: str = "audio.wav", lang: str = "hi") -> Dict[str, Any]:
    """
    Transcribes spoken voice note / audio query using Gnani.ai / Vach ASR API.
    """
    if not audio_bytes or len(audio_bytes) < 100:
        return {"success": False, "error": "Invalid or empty audio stream"}

    api_key = get_gnani_api_key()
    if not api_key:
        return {"success": False, "error": "GNANI_API_KEY not configured"}

    gnani_lang = GNANI_LANG_MAP.get(lang.lower(), "hi-IN")
    
    asr_endpoints = [
        "https://api.gnani.ai/vach/asr",
        "https://asr.gnani.ai/api/v1/asr",
        "https://asr-tts.gnani.ai/asr"
    ]

    headers = {
        "token": api_key,
        "Authorization": f"Bearer {api_key}",
        "x-api-key": api_key
    }

    files = {
        "audio": (filename, audio_bytes, "audio/wav")
    }
    data = {
        "lang": gnani_lang,
        "language": gnani_lang,
        "encoding": "wav"
    }

    for endpoint in asr_endpoints:
        try:
            logger.info(f"[Gnani ASR] Attempting transcription via {endpoint}...")
            resp = requests.post(endpoint, files=files, data=data, headers=headers, timeout=15)
            if resp.status_code == 200:
                res_data = resp.json()
                transcript = res_data.get("transcript") or res_data.get("text") or res_data.get("asr_output") or ""
                if transcript:
                    return {
                        "success": True,
                        "text": transcript.strip(),
                        "engine": "gnani_vach",
                        "lang": gnani_lang
                    }
            else:
                logger.warning(f"[Gnani ASR] {endpoint} returned status {resp.status_code}: {resp.text[:120]}")
        except Exception as e:
            logger.warning(f"[Gnani ASR] Connection to {endpoint} failed: {e}")

    return {
        "success": False,
        "error": "Gnani ASR service could not transcribe audio. Please try speaking clearly or typing."
    }
