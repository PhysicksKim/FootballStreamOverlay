import React from 'react';
import '@styles/Application.scss';
import TimerRoot from './TimerRoot';

import { FontProvider, useFont } from '@src/contexts/FontContext';
import { MainTimerStateRoot } from '@src/contexts/timers/main/MainTimerStateRoot';
import { InjuryTimerStateRoot } from '@src/contexts/timers/injury/InjuryTimerStateRoot';

const Application: React.FC = () => {
  return (
    <MainTimerStateRoot>
      <InjuryTimerStateRoot>
        <FontProvider>
          <TimerRoot />
        </FontProvider>
      </InjuryTimerStateRoot>
    </MainTimerStateRoot>
  );
};

export default Application;
