import { useState, useRef, useEffect, useCallback } from 'react';

// Minimal type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

interface SpeechRecognitionHook {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
}

// @ts-ignore
const SpeechRecognitionAPI: SpeechRecognitionStatic | undefined = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = (onResult: (transcript: string) => void): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleResult = useCallback((event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript.trim()) {
      onResult(finalTranscript.trim());
    }
  }, [onResult]);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const resultListener = (event: Event) => {
      handleResult(event as SpeechRecognitionEvent);
    };

    const errorListener = (event: Event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      console.error('Speech recognition error', errorEvent.error);
      setIsListening(false);
    };

    recognition.addEventListener('result', resultListener);
    recognition.addEventListener('error', errorListener);

    recognition.addEventListener('end', () => {
      // This event fires when recognition stops, either manually or automatically.
      setIsListening(false);
    });
    
    recognitionRef.current = recognition;

    return () => {
      recognition.removeEventListener('result', resultListener);
      recognition.removeEventListener('error', errorListener);
      recognition.stop();
    };
  }, [handleResult]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false); // Force state update immediately
    }
  }, [isListening]);

  return {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!SpeechRecognitionAPI,
  };
};
