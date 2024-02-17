import React from 'react';
import '@styles/Application.scss';
import TimerRoot from './TimerRoot';

import { FontProvider } from '@src/contexts/FontContext';
import { MainTimerStateRoot } from '@src/contexts/timers/main/MainTimerStateRoot';
import { InjuryTimerStateRoot } from '@src/contexts/timers/injury/InjuryTimerStateRoot';
import { TeamAProvider } from '@src/contexts/teams/TeamAProvider';
import { TeamBProvider } from '@src/contexts/teams/TeamBProvider';
import { RemoteHostClientProvider } from '@src/contexts/stomp/RemoteHostClientContext';
import { RemoteMemberClientProvider } from '@src/contexts/stomp/RemoteMemberClientContext';
import { TeamAStyleProvider } from '@src/contexts/teams/TeamAStyleProvider';
import { TeamBStyleProvider } from '@src/contexts/teams/TeamBStyleProvider';
import { MatchNameProvider } from '@src/contexts/MatchNameContext';
import { InjuryTimeInfoProvider } from '@src/contexts/timers/injury/InjuryTimeInfoProvider';

const Application: React.FC = () => {
  return (
    <MainTimerStateRoot>
      <InjuryTimerStateRoot>
        <InjuryTimeInfoProvider>
          <TeamAProvider>
            <TeamBProvider>
              <TeamAStyleProvider>
                <TeamBStyleProvider>
                  <FontProvider>
                    <MatchNameProvider>
                      <RemoteHostClientProvider>
                        <RemoteMemberClientProvider>
                          <TimerRoot />
                        </RemoteMemberClientProvider>
                      </RemoteHostClientProvider>
                    </MatchNameProvider>
                  </FontProvider>
                </TeamBStyleProvider>
              </TeamAStyleProvider>
            </TeamBProvider>
          </TeamAProvider>
        </InjuryTimeInfoProvider>
      </InjuryTimerStateRoot>
    </MainTimerStateRoot>
  );
};

export default Application;
