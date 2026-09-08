'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AudioSpeed = 0.8 | 1 | 1.2;
export type InterviewAudioState = 'idle' | 'playing' | 'paused';
export type AudioRange = { start: number; end: number };
export type SpeechMapping = { text: string; speechToCanonical: number[] };

const SPEED_KEY = 'ee.interview.audio-speed.v1';
const speeds: AudioSpeed[] = [0.8, 1, 1.2];

export function buildSpeechMapping(canonical: string): SpeechMapping {
  const text: string[] = [];
  const speechToCanonical: number[] = [];
  let markup = false;
  for (let index = 0; index < canonical.length; index += 1) {
    if (canonical[index] === '*') { markup = !markup; continue; }
    if (markup) continue;
    text.push(canonical[index] === '/' ? ' ' : canonical[index]);
    speechToCanonical.push(index);
  }
  return { text: text.join('').replace(/\s+$/g, ''), speechToCanonical };
}

function readSpeed(): AudioSpeed {
  const value = Number(window.localStorage.getItem(SPEED_KEY));
  return speeds.includes(value as AudioSpeed) ? value as AudioSpeed : 1;
}

function preferredVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.lang.toLowerCase() === 'en-us')
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en-'))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));
}

type PlayRequest = { text: string; src?: string; key: string; mapping?: SpeechMapping };

export function useInterviewAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechRequestRef = useRef<PlayRequest | null>(null);
  const fallbackRef = useRef<PlayRequest | null>(null);
  const playbackIdRef = useRef(0);
  const sourceRef = useRef<'audio' | 'speech' | null>(null);
  const [speed, setSpeedState] = useState<AudioSpeed>(1);
  const [state, setState] = useState<InterviewAudioState>('idle');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<AudioRange | null>(null);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setSpeedState(readSpeed());
    const available = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    setSpeechAvailable(available);
    if (!available) return;
    const refresh = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
    refresh();
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refresh);
  }, []);

  const stop = useCallback(() => {
    playbackIdRef.current += 1;
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    speechRequestRef.current = null;
    fallbackRef.current = null;
    sourceRef.current = null;
    setState('idle');
    setActiveKey(null);
    setActiveRange(null);
  }, []);

  const speak = useCallback((request: PlayRequest) => {
    if (!speechAvailable || !request.text.trim()) return;
    const mapping = request.mapping ?? buildSpeechMapping(request.text);
    const utterance = new SpeechSynthesisUtterance(mapping.text);
    utterance.rate = speed;
    const voice = preferredVoice(voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;
    sourceRef.current = 'speech';
    utterance.onstart = () => { if (utteranceRef.current !== utterance) return; setState('playing'); setActiveKey(request.key); };
    utterance.onboundary = (event) => {
      if (utteranceRef.current !== utterance || typeof event.charIndex !== 'number') return;
      const start = mapping.speechToCanonical[event.charIndex];
      if (start === undefined) return;
      const length = Math.max(1, event.charLength ?? 1);
      const endSpeech = Math.min(mapping.speechToCanonical.length - 1, event.charIndex + length - 1);
      setActiveRange({ start, end: mapping.speechToCanonical[endSpeech] ?? start });
    };
    utterance.onend = () => { if (utteranceRef.current !== utterance) return; utteranceRef.current = null; speechRequestRef.current = null; sourceRef.current = null; setState('idle'); setActiveKey(null); setActiveRange(null); };
    utterance.onerror = () => { if (utteranceRef.current !== utterance) return; utteranceRef.current = null; speechRequestRef.current = null; sourceRef.current = null; setState('idle'); setActiveKey(null); setActiveRange(null); };
    utteranceRef.current = utterance;
    speechRequestRef.current = request;
    window.speechSynthesis.speak(utterance);
    setState('playing');
    setActiveKey(request.key);
    setActiveRange(null);
  }, [speechAvailable, speed]);

  const play = useCallback((request: PlayRequest) => {
    stop();
    if (request.src) {
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      const playbackId = playbackIdRef.current;
      sourceRef.current = 'audio';
      audio.src = request.src;
      audio.preload = 'auto';
      audio.playbackRate = speed;
      audio.onended = () => { if (playbackIdRef.current !== playbackId) return; sourceRef.current = null; setState('idle'); setActiveKey(null); setActiveRange(null); };
      audio.onerror = () => {
        if (playbackIdRef.current !== playbackId) return;
        if (fallbackRef.current?.key === request.key && speechAvailable) {
          const fallback = fallbackRef.current;
          fallbackRef.current = null;
          speak(fallback);
        } else {
          sourceRef.current = null;
          setState('idle');
          setActiveKey(null);
          setActiveRange(null);
        }
      };
      fallbackRef.current = { ...request, mapping: request.mapping ?? buildSpeechMapping(request.text) };
      setActiveKey(request.key);
      setActiveRange(null);
      setState('playing');
      void audio.play().catch(() => {
        if (playbackIdRef.current !== playbackId) return;
        if (fallbackRef.current?.key === request.key && speechAvailable) {
          const fallback = fallbackRef.current;
          fallbackRef.current = null;
          speak(fallback);
        } else {
          sourceRef.current = null;
          setState('idle');
          setActiveKey(null);
          setActiveRange(null);
        }
      });
      return;
    }
    speak(request);
  }, [speak, speed, speechAvailable, stop]);

  const pause = useCallback(() => {
    if (sourceRef.current === 'audio' && audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); setState('paused'); }
    else if (sourceRef.current === 'speech' && speechAvailable && window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setState('paused'); }
  }, [speechAvailable]);

  const resume = useCallback(() => {
    if (sourceRef.current === 'audio' && audioRef.current?.paused && audioRef.current.currentTime > 0) { void audioRef.current.play(); setState('playing'); }
    else if (sourceRef.current === 'speech' && speechAvailable && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setState('playing'); }
  }, [speechAvailable]);

  const restart = useCallback((request: PlayRequest) => play(request), [play]);

  const setSpeed = useCallback((value: AudioSpeed) => {
    window.localStorage.setItem(SPEED_KEY, String(value));
    setSpeedState(value);
    if (audioRef.current && sourceRef.current === 'audio') audioRef.current.playbackRate = value;
    if (utteranceRef.current && sourceRef.current === 'speech') {
      const request = speechRequestRef.current;
      if (!request) return;
      window.speechSynthesis.cancel();
      speak(request);
    }
  }, [speak]);

  useEffect(() => stop, [stop]);

  return { speed, setSpeed, state, activeKey, activeRange, speechAvailable, play, pause, resume, stop, restart };
}
