import React, { ReactNode, useEffect, useState } from 'react';

import useTimerHook from '@src/hooks/useTimerHook';
import { InjuryTimeDisplayProvider } from './InjuryTimeDisplayProvider';
import { InjuryTimerManagerProvider } from './InjuryTimerManagerProvider';
import { timeToZeroFillString } from '@src/classes/Utils';

export const InjuryTimerStateRoot: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [injuryTimer, injuryEventEmitter] = useTimerHook();
  const [injuryTimeDisplay, setInjuryTimeDisplay] = useState('00:00');

  useEffect(() => {
    setInjuryTimeDisplay(timeToZeroFillString(injuryTimer.time));
  }, [injuryTimer.time]);

  return (
    <InjuryTimerManagerProvider
      setInjuryTimeDisplay={setInjuryTimeDisplay}
      timer={injuryTimer}
      eventEmitter={injuryEventEmitter}
    >
      <InjuryTimeDisplayProvider
        injuryTimeDisplay={injuryTimeDisplay}
        setInjuryTimeDisplay={setInjuryTimeDisplay}
      >
        {children}
      </InjuryTimeDisplayProvider>
    </InjuryTimerManagerProvider>
  );
};
