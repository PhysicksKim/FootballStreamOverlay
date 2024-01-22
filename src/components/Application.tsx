import React from 'react';
import '@styles/Application.scss';
import TimerRoot from './TimerRoot';

import { FontProvider, useFont } from '@src/contexts/FontContext';
import { MainTimerStateRoot } from '@src/contexts/timers/main/MainTimerStateRoot';

const Application: React.FC = () => {
  return (
    <MainTimerStateRoot>
      <FontProvider>
        <TimerRoot />
      </FontProvider>
    </MainTimerStateRoot>
  );
};

export default Application;
