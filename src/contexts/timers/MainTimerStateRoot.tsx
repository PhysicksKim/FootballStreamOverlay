import React, { ReactNode, createContext, useState } from 'react';

import { timeToZeroFillString } from '@src/classes/Utils';
import useTimerHook, { TimerState } from '@src/hooks/useTimerHook';
import { Time } from '@src/types/types';

export interface TimerManager {
  timer: TimerState;
  startTimer: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setTimer: (time: { min: number; sec: number }) => void;
}

export const MainTimerContext = createContext<TimerManager | undefined>(
  undefined,
);

export const MainTimerProvider: React.FC<{
  children: ReactNode;
  setMainTimeDisplay: (time: string) => void;
  timer: TimerState;
}> = ({ children, setMainTimeDisplay, timer }) => {
  const mainTimer = timer;

  const mainTimerManager: TimerManager = {
    timer: mainTimer,
    startTimer: (time: Time) => {
      mainTimer.start(time.min, time.sec);
      setMainTimeDisplay(timeToZeroFillString(time));
    },
    resumeTimer: mainTimer.resume,
    pauseTimer: mainTimer.pause,
    setTimer: (time: Time) => {
      mainTimer.set(time.min, time.sec);
      setMainTimeDisplay(timeToZeroFillString(time));
    },
  };

  return (
    <MainTimerContext.Provider value={mainTimerManager}>
      {children}
    </MainTimerContext.Provider>
  );
};

// -------

export const MainTimeDisplayContext = createContext<string | undefined>(
  undefined,
);

export const MainTimeDisplayProvider: React.FC<{
  children: ReactNode;
  mainTimeDisplay: string;
}> = ({ children, mainTimeDisplay }) => {
  return (
    <MainTimeDisplayContext.Provider value={mainTimeDisplay}>
      {children}
    </MainTimeDisplayContext.Provider>
  );
};

// -------

export const MainTimerStateRoot: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mainTimer, mainEventEmitter] = useTimerHook();
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');

  return (
    <MainTimerProvider
      setMainTimeDisplay={setMainTimeDisplay}
      timer={mainTimer}
    >
      <MainTimeDisplayProvider mainTimeDisplay={mainTimeDisplay}>
        {children}
      </MainTimeDisplayProvider>
    </MainTimerProvider>
  );
};

// TODO : 근데 나중에 전광판 페이지와 컨트롤 페이지를 분리할 거잖아. 그러면 mainTimer 와 setMainTimeDisplay 를 분리하는 것도 생각해봐야겠다.
// 근데 어차피 싹다바꿔잖아? 에이 그냥 일단 만들자
