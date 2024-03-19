import { TimerManager, Time } from '@src/types/types';
import React, { ReactNode, createContext, useContext } from 'react';

import { timeToZeroFillString } from '@src/classes/Utils';
import { TimerState } from '@src/hooks/useTimerHook';
import EventEmitter from 'events';

const MainTimerContext = createContext<TimerManager | undefined>(undefined);

/**
 * { timer, startTimer, pauseTimer, resumeTimer, setTimer, eventEmitter }
 * @returns TimerManager : { timer, startTimer, pauseTimer, resumeTimer, setTimer, eventEmitter }
 */
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
  eventEmitter: EventEmitter;
}> = ({
  children,
  setMainTimeDisplay,
  timer: mainTimer,
  eventEmitter: mainEventEmitter,
}) => {
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
    eventEmitter: mainEventEmitter,
  };

  return (
    <MainTimerContext.Provider value={mainTimerManager}>
      {children}
    </MainTimerContext.Provider>
  );
};
