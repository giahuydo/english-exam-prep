'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { buildSpeechMapping, type SpeechMapping } from './audio-mapping';
export { buildSpeechMapping } from './audio-mapping';
export type { SpeechMapping } from './audio-mapping';

export type AudioSpeed = 0.5 | 0.8 | 1 | 1.2;
export type InterviewAudioState = 'idle' | 'playing' | 'paused';
export type AudioRange = { start: number; end: number };
export type StaticAlignment = { version: 1; questionId: string; speechText: string; words: { text: string; canonicalStart: number; canonicalEnd: number; startMs: number; endMs: number }[] };
export type AudioSegment = { canonicalStart: number; canonicalEnd: number };
type AlignmentWord = StaticAlignment['words'][number];

type SpeakingBeat = { first: number; last: number; startMs: number; endMs: number };

function buildSpeakingBeats(words: AlignmentWord[]): SpeakingBeat[] {
  const beats: SpeakingBeat[] = [];
  let first = 0;
  for (let index = 0; index < words.length - 1; index += 1) {
    const current = words[index];
    const next = words[index + 1];
    const gap = next.startMs - current.endMs;
    const duration = next.startMs - words[first].startMs;
    const boundary = gap >= 70 || /[.!?,;:]$/.test(current.text) || duration >= 1200 || index - first >= 6;
    if (!boundary) continue;
    beats.push({ first, last: index, startMs: words[first].startMs, endMs: current.endMs });
    first = index + 1;
  }
  if (first < words.length) beats.push({ first, last: words.length - 1, startMs: words[first].startMs, endMs: words[words.length - 1].endMs });
  return beats;
}

function speakingBeatAtTime(words: AlignmentWord[], beats: SpeakingBeat[], currentMs: number): AudioRange | null {
  let low = 0;
  let high = beats.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (beats[middle].startMs <= currentMs) {
      found = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  if (found < 0) return null;
  const beat = beats[found];
  return { start: words[beat.first].canonicalStart, end: words[beat.last].canonicalEnd };
}

const SPEED_KEY = 'ee.interview.audio-speed.v1';
const speeds: AudioSpeed[] = [0.5, 0.8, 1, 1.2];

function readSpeed(): AudioSpeed {
  const value = Number(window.localStorage.getItem(SPEED_KEY));
  return speeds.includes(value as AudioSpeed) ? value as AudioSpeed : 1;
}

function preferredVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.lang.toLowerCase() === 'en-us')
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en-'))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));
}

type PlayRequest = { text: string; src?: string; alignment?: string; key: string; mapping?: SpeechMapping; segment?: AudioSegment; speed?: AudioSpeed };

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
  const [activeSpeed, setActiveSpeed] = useState<AudioSpeed | null>(null);
  const [activeRange, setActiveRange] = useState<AudioRange | null>(null);
  const [repeat, setRepeatState] = useState(false);
  const repeatRef = useRef(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const alignmentRef = useRef<StaticAlignment | null>(null);
  const frameRef = useRef<number | null>(null);
  const frameCallbackRef = useRef<(() => void) | null>(null);

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
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    alignmentRef.current = null;
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
    setActiveSpeed(null);
    setActiveRange(null);
  }, []);

  const speak = useCallback((request: PlayRequest) => {
    if (!speechAvailable || !request.text.trim()) return;
    const mapping = request.mapping ?? buildSpeechMapping(request.text);
    const utterance = new SpeechSynthesisUtterance(mapping.text);
    utterance.rate = request.speed ?? speed;
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
    utterance.onend = () => {
      if (utteranceRef.current !== utterance) return;
      utteranceRef.current = null;
      if (repeatRef.current) {
        speak(request);
        return;
      }
      speechRequestRef.current = null;
      sourceRef.current = null;
      setState('idle');
      setActiveKey(null);
      setActiveRange(null);
    };
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
      audio.playbackRate = request.speed ?? speed;
      let segmentStartMs = 0;
      let segmentEndMs: number | null = null;
      let speakingBeats: SpeakingBeat[] = [];
      const updateRange = () => {
        if (playbackIdRef.current !== playbackId || sourceRef.current !== 'audio') return;
        if (segmentEndMs !== null && audio.currentTime * 1000 >= segmentEndMs) {
          audio.pause();
          audio.onended?.(new Event('ended'));
          return;
        }
        const words = alignmentRef.current?.words ?? [];
        const currentMs = audio.currentTime * 1000;
        setActiveRange(speakingBeatAtTime(words, speakingBeats, currentMs));
            frameCallbackRef.current = updateRange;
        frameRef.current = requestAnimationFrame(updateRange);
      };
      const startSegmentPlayback = () => {
        audio.currentTime = segmentStartMs / 1000;
        setActiveKey(request.key);
        setActiveSpeed(request.speed ?? speed);
        setActiveRange(null);
        setState('playing');
        frameCallbackRef.current = updateRange;
        frameRef.current = requestAnimationFrame(updateRange);
        void audio.play();
      };
      audio.onended = () => {
        if (playbackIdRef.current !== playbackId) return;
        if (repeatRef.current) {
          startSegmentPlayback();
          return;
        }
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        alignmentRef.current = null;
        sourceRef.current = null;
        setState('idle');
        setActiveKey(null);
        setActiveRange(null);
      };
      audio.onerror = () => {
        if (playbackIdRef.current !== playbackId) return;
        sourceRef.current = null;
        setState('idle');
        setActiveKey(null);
        setActiveRange(null);
      };
      fallbackRef.current = null;
      const startPlayback = (alignment: StaticAlignment | null) => {
        if (playbackIdRef.current !== playbackId || sourceRef.current !== 'audio') return;
        alignmentRef.current = alignment;
        speakingBeats = alignment ? buildSpeakingBeats(alignment.words) : [];
        if (request.segment && alignment) {
          const segmentWords = alignment.words.filter((word) => word.canonicalEnd > request.segment!.canonicalStart && word.canonicalStart < request.segment!.canonicalEnd);
          if (segmentWords.length) {
            segmentStartMs = segmentWords[0].startMs;
            segmentEndMs = segmentWords[segmentWords.length - 1].endMs;
            audio.currentTime = segmentStartMs / 1000;
          }
        }
        setActiveKey(request.key);
        setActiveSpeed(request.speed ?? speed);
        setActiveRange(null);
        setState('playing');
        frameCallbackRef.current = updateRange;
        frameRef.current = requestAnimationFrame(updateRange);
        void audio.play().catch(() => {
          if (playbackIdRef.current !== playbackId) return;
          sourceRef.current = null;
          setState('idle');
          setActiveKey(null);
          setActiveRange(null);
        });
      };
      if (request.alignment) {
        void fetch(request.alignment).then((response) => response.ok ? response.json() as Promise<StaticAlignment> : null).then(startPlayback).catch(() => startPlayback(null));
      } else {
        startPlayback(null);
      }
      return;
    }
    speak(request);
  }, [speak, speed, stop]);

  const pause = useCallback(() => {
    if (sourceRef.current === 'audio' && audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null; setState('paused'); }
    else if (sourceRef.current === 'speech' && speechAvailable && window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setState('paused'); }
  }, [speechAvailable]);

  const resume = useCallback(() => {
    if (sourceRef.current === 'audio' && audioRef.current?.paused && audioRef.current.currentTime > 0) { if (frameCallbackRef.current) frameRef.current = requestAnimationFrame(frameCallbackRef.current); void audioRef.current.play(); setState('playing'); }
    else if (sourceRef.current === 'speech' && speechAvailable && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setState('playing'); }
  }, [speechAvailable]);

  const restart = useCallback((request: PlayRequest) => play(request), [play]);
  const setRepeat = useCallback((value: boolean) => {
    repeatRef.current = value;
    setRepeatState(value);
  }, []);

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

  return { speed, setSpeed, repeat, setRepeat, state, activeKey, activeSpeed, activeRange, speechAvailable, play, pause, resume, stop, restart };
}
