import { TimerState } from '@src/hooks/useTimerHook';
import { EventEmitter } from 'events';

/**
 *
 * min: number;
 * sec: number;
 */
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

export enum UniformEnum {
  HOME = 'HOME',
  AWAY = 'AWAY',
  THIRD = 'THIRD',
}

/**
 * ```typescript
 * category: string;
 * code: string;
 * name: string;
 * score: number;
 * isAway?: boolean;
 * uniform: string;
 * ```
 */
export interface Team {
  category: string;
  code: string;
  name: string;
  score: number;
  // isAway?: boolean;
  uniform: string;
}

export interface TeamCodesAndNames {
  [key: string]: { code: string; name: string };
}

interface WsBaseMessage {
  type: string;
  metadata: {
    timestamp: number;
    messageId: string;
  };
}

export interface WsScoreMessage extends WsBaseMessage {
  data: {
    teamA: number;
    teamB: number;
  };
}

export interface WsUniformMessage extends WsBaseMessage {
  data: {
    teamA: 'HOME' | 'AWAY' | 'THIRD';
    teamB: 'HOME' | 'AWAY' | 'THIRD';
  };
}

export interface WsGivenInjuryMessage extends WsBaseMessage {
  data: {
    givenInjury: number;
  };
}

export type TeamStyles = {
  fontColor: string;
  fontWeight: 'normal' | 'bold';
};

export type FontColorOptions = 'default' | 'black';
export type TeamSelect = 'teamA' | 'teamB';
export type TeamElement = 'name' | 'score';

export type TeamFontColor = {
  teamAColor: {
    name: FontColorOptions;
    score: FontColorOptions;
  };
  teamBColor: {
    name: FontColorOptions;
    score: FontColorOptions;
  };
  updateTeamFontColor: (
    team: TeamSelect,
    element: TeamElement,
    color: FontColorOptions,
  ) => void;
};
