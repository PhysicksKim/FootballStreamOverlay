import React, { ReactNode, useEffect, useState } from 'react';

import useTimerHook from '@src/hooks/useTimerHook';
import { MainTimeDisplayProvider } from './MainTimeDisplayProvider';
import { MainTimerManagerProvider } from './MainTimerManagerProvider';
import { timeToZeroFillString } from '@src/classes/Utils';

export const MainTimerStateRoot: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mainTimer, mainEventEmitter] = useTimerHook();
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');

  useEffect(() => {
    setMainTimeDisplay(timeToZeroFillString(mainTimer.time));
  }, [mainTimer.time]);

  return (
    <MainTimerManagerProvider
      setMainTimeDisplay={setMainTimeDisplay}
      timer={mainTimer}
      eventEmitter={mainEventEmitter}
    >
      <MainTimeDisplayProvider
        mainTimeDisplay={mainTimeDisplay}
        setMainTimeDisplay={setMainTimeDisplay}
      >
        {children}
      </MainTimeDisplayProvider>
    </MainTimerManagerProvider>
  );
};
