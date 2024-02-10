import React from 'react';
import '@styles/Application.scss';
import TimerRoot from './TimerRoot';

import { FontProvider } from '@src/contexts/FontContext';
import { MainTimerStateRoot } from '@src/contexts/timers/main/MainTimerStateRoot';
import { InjuryTimerStateRoot } from '@src/contexts/timers/injury/InjuryTimerStateRoot';
import { TeamAProvider } from '@src/contexts/teams/TeamAProvider';
import { TeamBProvider } from '@src/contexts/teams/TeamBProvider';
import { StompBoardClientProvider } from '@src/contexts/stomp/StompBoardClientContext';
import { StompControlClientProvider } from '@src/contexts/stomp/StompControlClientContext';
import RemoteMessageManager from './manager/RemoteMessageManager';
import { TeamAStyleProvider } from '@src/contexts/teams/TeamAStyleProvider';
import { TeamBStyleProvider } from '@src/contexts/teams/TeamBStyleProvider';

const Application: React.FC = () => {
  return (
    <MainTimerStateRoot>
      <InjuryTimerStateRoot>
        <TeamAProvider>
          <TeamBProvider>
            <TeamAStyleProvider>
              <TeamBStyleProvider>
                <FontProvider>
                  <StompBoardClientProvider>
                    <StompControlClientProvider>
                      <TimerRoot />
                    </StompControlClientProvider>
                  </StompBoardClientProvider>
                </FontProvider>
              </TeamBStyleProvider>
            </TeamAStyleProvider>
          </TeamBProvider>
        </TeamAProvider>
      </InjuryTimerStateRoot>
    </MainTimerStateRoot>
  );
};

export default Application;
