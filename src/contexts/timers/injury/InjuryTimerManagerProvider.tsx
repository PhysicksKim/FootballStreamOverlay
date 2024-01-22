import { TimerManager, Time } from '@src/types/types';
import React, { ReactNode, createContext, useContext } from 'react';

import { timeToZeroFillString } from '@src/classes/Utils';
import { TimerState } from '@src/hooks/useTimerHook';
import EventEmitter from 'events';

const InjuryTimerContext = createContext<TimerManager | undefined>(undefined);

export const useInjuryTimerManager = () => {
  const context = useContext(InjuryTimerContext);
  if (!context) {
    throw new Error(
      'useInjuryTimerManager must be used within a InjuryTimerStateRoot',
    );
  }
  return context;
};

export const InjuryTimerManagerProvider: React.FC<{
  children: ReactNode;
  setInjuryTimeDisplay: (time: string) => void;
  timer: TimerState;
  eventEmitter: EventEmitter;
}> = ({
  children,
  setInjuryTimeDisplay,
  timer: injuryTimer,
  eventEmitter: injuryEventEmitter,
}) => {
  const injuryTimerManager: TimerManager = {
    timer: injuryTimer,
    startTimer: (time: Time) => {
      injuryTimer.start(time.min, time.sec);
      setInjuryTimeDisplay(timeToZeroFillString(time));
    },
    resumeTimer: injuryTimer.resume,
    pauseTimer: injuryTimer.pause,
    setTimer: (time: Time) => {
      injuryTimer.set(time.min, time.sec);
      setInjuryTimeDisplay(timeToZeroFillString(time));
    },
    eventEmitter: injuryEventEmitter,
  };

  return (
    <InjuryTimerContext.Provider value={injuryTimerManager}>
      {children}
    </InjuryTimerContext.Provider>
  );
};
