import React from 'react';
import '@styles/Application.scss';
import TimerRoot from './TimerRoot';

import { MainTimerStateRoot } from '@src/contexts/timers/main/MainTimerStateRoot';
import { InjuryTimerStateRoot } from '@src/contexts/timers/injury/InjuryTimerStateRoot';
import { TeamAProvider } from '@src/contexts/teams/TeamAProvider';
import { TeamBProvider } from '@src/contexts/teams/TeamBProvider';
import { TeamAStyleProvider } from '@src/contexts/teams/TeamAStyleProvider';
import { TeamBStyleProvider } from '@src/contexts/teams/TeamBStyleProvider';
import { MatchNameProvider } from '@src/contexts/MatchNameContext';
import { RemoteClientProvider } from '@src/contexts/stomp/RemoteClientContext';
import { CookiesProvider } from 'react-cookie';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@src/redux/Store';

const Application: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <CookiesProvider>
        <MainTimerStateRoot>
          <InjuryTimerStateRoot>
            <TeamAProvider>
              <TeamBProvider>
                <TeamAStyleProvider>
                  <TeamBStyleProvider>
                    <MatchNameProvider>
                      <RemoteClientProvider>
                        <TimerRoot />
                      </RemoteClientProvider>
                    </MatchNameProvider>
                  </TeamBStyleProvider>
                </TeamAStyleProvider>
              </TeamBProvider>
            </TeamAProvider>
          </InjuryTimerStateRoot>
        </MainTimerStateRoot>
      </CookiesProvider>
    </ReduxProvider>
  );
};

export default Application;
