import { TimerManager } from '@src/components/TimerRoot';
import React, { ReactNode, createContext, useContext } from 'react';

import { timeToZeroFillString } from '@src/classes/Utils';
import { TimerState } from '@src/hooks/useTimerHook';
import { Time } from '@src/types/types';

const MainTimerContext = createContext<TimerManager | undefined>(undefined);

export const useMainTimerManager = () => {
  const context = useContext(MainTimerContext);
  if (!context) {
    throw new Error(
      'useMainTimerManager must be used within a MainTimerStateRoot',
    );
  }
  return context;
};

export const MainTimerManagerProvider: React.FC<{
  children: ReactNode;
  setMainTimeDisplay: (time: string) => void;
  timer: TimerState;
}> = ({ children, setMainTimeDisplay, timer: mainTimer }) => {
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
