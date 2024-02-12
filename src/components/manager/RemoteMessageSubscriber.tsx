import { useFont } from '@src/contexts/FontContext';
import { useStompBoardClient } from '@src/contexts/stomp/StompBoardClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useInjuryTimeDisplay } from '@src/contexts/timers/injury/InjuryTimeDisplayProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimeDisplay } from '@src/contexts/timers/main/MainTimeDisplayProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import React, { useEffect } from 'react';

const RemoteMessageSubscriber = () => {
  const {
    clientRef: boardClientRef,
    remoteSubInfo,
    isConnected: isBoardConnected,
    receiveRemoteMsg,
  } = useStompBoardClient();

  // TODO : 메세지 수신에 따라서 state 변화 해야함
  useEffect(() => {
    if (isBoardConnected) {
      console.log('RemoteMessageSubscriber recvMessage: ', receiveRemoteMsg);
    }
  }, [receiveRemoteMsg]);

  useFont();
  useTeamA();
  useTeamB();
  const { mainTimeDisplay, setMainTimeDisplay } = useMainTimeDisplay();
  const {
    timer: mainTimer,
    startTimer: startMainTimer,
    pauseTimer: pauseMainTimer,
    resumeTimer: resumeMainTimer,
    setTimer: setMainTimer,
    eventEmitter: mainEventEmitter,
  } = useMainTimerManager();

  const { injuryTimeDisplay, setInjuryTimeDisplay } = useInjuryTimeDisplay();
  const {
    timer: injuryTimer,
    startTimer: startInjuryTimer,
    pauseTimer: pauseInjuryTimer,
    resumeTimer: resumeInjuryTimer,
    setTimer: setInjuryTimer,
    eventEmitter: injuryEventEmitter,
  } = useInjuryTimerManager();

  useEffect(() => {
    console.log(
      'from STOMP manager : main timer state changed',
      mainTimer.isRunning,
    );
  }, [mainTimer.isRunning]);

  const solveMessage = (message: string) => {
    return message;
  };

  return <div>RemoteMessageSubscriber</div>;
};

export default RemoteMessageSubscriber;
