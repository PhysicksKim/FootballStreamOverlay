import { TimerState } from '@src/hooks/useTimerHook';
import { EventEmitter } from 'events';

export interface Time {
  min: number;
  sec: number;
}

export interface TimerManager {
  timer: TimerState;
  startTimer: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setTimer: (time: { min: number; sec: number }) => void;
  eventEmitter?: EventEmitter;
}

export interface Team {
  category: string;
  code: string;
  name: string;
  score: number;
  isAway: boolean;
}
