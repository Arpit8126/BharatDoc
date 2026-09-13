/**
 * BharatDoc Voice Intelligence Layer (Indic Speech Engine + Web Speech Fallback)
 * Handles:
 * - Indic Text-to-Speech (TTS) with natural regional pronunciation
 * - Real-time Voice Speech-to-Text (STT) with live interim text & auto-submit
 * - Dual-layer speech recognition (Web Speech Recognition + Backend ASR Proxy)
 */

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000';

let currentAudio: HTMLAudioElement | null = null;

export interface VoicePlaybackController {
  stop: () => void;
  isPlaying: boolean;
}

/**
 * Stops all currently active speech playback (both HTML5 Audio and Web Speech Synthesis)
 */
export function stopAllSpeech(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

/**
 * Plays vernacular text-to-speech using Indic engine with browser Web Speech fallback.
 */
export async function playIndicSpeech(options: {
  text: string;
  lang?: string;
  gender?: 'female' | 'male';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}): Promise<VoicePlaybackController> {
  stopAllSpeech();

  const { text, lang = 'hi', gender = 'female', onStart, onEnd, onError } = options;
  if (!text || !text.trim()) {
    if (onError) onError(new Error('Empty text'));
    return { stop: () => {}, isPlaying: false };
  }

  let isPlaying = true;
  const controller: VoicePlaybackController = {
    stop: () => {
      isPlaying = false;
      stopAllSpeech();
      if (onEnd) onEnd();
    },
    isPlaying: true,
  };

  try {
    // 1. Attempt Voice TTS API through backend proxy
    const resp = await fetch(`${BACKEND_URL}/api/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang, gender }),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.success && (data.audio_base64 || data.audio_url)) {
        const audioSrc = data.audio_base64
          ? `data:${data.format || 'audio/wav'};base64,${data.audio_base64}`
          : data.audio_url;

        const audio = new Audio(audioSrc);
        currentAudio = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          isPlaying = false;
          currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('[Audio Playback Error, falling back to Web Speech]', e);
          fallbackWebSpeech(text, lang, onStart, onEnd, onError);
        };

        await audio.play();
        return controller;
      }
    }
  } catch (err) {
    console.warn('[Voice API unreachable, falling back to Web Speech]', err);
  }

  // 2. Graceful fallback to browser Web Speech API
  fallbackWebSpeech(text, lang, onStart, onEnd, onError);
  return controller;
}

/**
 * Fallback Web Speech Synthesis
 */
function fallbackWebSpeech(
  text: string,
  lang: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onStart) onStart();
    setTimeout(() => { if (onEnd) onEnd(); }, 3000);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const langMap: Record<string, string> = {
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    en: 'en-IN',
  };

  utterance.lang = langMap[lang.toLowerCase()] || 'en-IN';
  utterance.rate = 0.9;

  utterance.onstart = () => { if (onStart) onStart(); };
  utterance.onend = () => { if (onEnd) onEnd(); };
  utterance.onerror = (e) => {
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

const LANG_SPEECH_MAP: Record<string, string> = {
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
  en: 'en-IN',
};

/**
 * High-Reliability Dual-Layer Indic Voice Recognizer (Live STT)
 * Uses native Web Speech Recognition API with automatic backend fallback
 */
export class IndicVoiceRecorder {
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private latestTranscript: string = '';
  private onInterimCallback: ((text: string) => void) | null = null;
  private onAutoFinalCallback: ((text: string) => void) | null = null;
  private isListening: boolean = false;
  private hasSubmitted: boolean = false;

  async start(
    lang: string = 'hi',
    onInterim?: (text: string) => void,
    onAutoFinal?: (text: string) => void
  ): Promise<boolean> {
    this.latestTranscript = '';
    this.hasSubmitted = false;
    this.onInterimCallback = onInterim || null;
    this.onAutoFinalCallback = onAutoFinal || null;
    this.isListening = true;

    // 1. Setup Web Speech Recognition (Google Chrome, Edge, Safari, Android)
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognitionStarted = false;

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = LANG_SPEECH_MAP[lang.toLowerCase()] || 'hi-IN';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          const currentText = (final || interim).trim();
          if (currentText) {
            this.latestTranscript = currentText;
            if (this.onInterimCallback) {
              this.onInterimCallback(currentText);
            }
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('[Speech Recognition notice]:', err.error);
        };

        recognition.onend = () => {
          this.isListening = false;
          const text = this.latestTranscript.trim();
          this.cleanUpStream();
          if (text && !this.hasSubmitted && this.onAutoFinalCallback) {
            this.hasSubmitted = true;
            this.onAutoFinalCallback(text);
          }
        };

        recognition.start();
        this.recognition = recognition;
        recognitionStarted = true;
      } catch (e) {
        console.warn('[Web Speech Recognition could not start, will use MediaRecorder fallback]:', e);
      }
    }

    // 2. Parallel Microphone Audio Capture for backend transcription fallback
    try {
      this.audioChunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      if (recognitionStarted) {
        return true;
      }
      console.error('[Microphone Permission Error]:', err);
      return false;
    }
  }

  async stopAndTranscribe(lang: string = 'hi'): Promise<string> {
    this.isListening = false;

    // Stop recognition instance
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }

    // If live speech recognition already got the sentence, return it immediately
    if (this.latestTranscript && this.latestTranscript.trim()) {
      this.hasSubmitted = true;
      this.cleanUpStream();
      return this.latestTranscript.trim();
    }

    // Fallback: Send audio stream to backend STT endpoint
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.hasSubmitted = true;
        this.cleanUpStream();
        resolve(this.latestTranscript || '');
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          this.cleanUpStream();

          if (this.latestTranscript && this.latestTranscript.trim()) {
            this.hasSubmitted = true;
            resolve(this.latestTranscript.trim());
            return;
          }

          if (this.audioChunks.length === 0) {
            this.hasSubmitted = true;
            resolve('');
            return;
          }

          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'speech_query.wav');
          formData.append('lang', lang);

          const res = await fetch(`${BACKEND_URL}/api/voice/stt`, {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const d = await res.json();
            if (d.success && d.text) {
              this.hasSubmitted = true;
              resolve(d.text.trim());
              return;
            }
          }
          this.hasSubmitted = true;
          resolve(this.latestTranscript || '');
        } catch (err) {
          console.warn('[Backend STT fallback notice]:', err);
          this.hasSubmitted = true;
          resolve(this.latestTranscript || '');
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (_) {
        this.hasSubmitted = true;
        this.cleanUpStream();
        resolve(this.latestTranscript || '');
      }
    });
  }

  private cleanUpStream(): void {
    if (this.stream) {
      try {
        this.stream.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      this.stream = null;
    }
    this.audioChunks = [];
  }

  cancel(): void {
    this.isListening = false;
    this.hasSubmitted = true;
    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
      this.recognition = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch (_) {}
    }
    this.cleanUpStream();
  }
}
