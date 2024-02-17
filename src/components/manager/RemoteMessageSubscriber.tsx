import { useFont } from '@src/contexts/FontContext';
import { useRemoteHostClient } from '@src/contexts/stomp/RemoteHostClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useInjuryTimeDisplay } from '@src/contexts/timers/injury/InjuryTimeDisplayProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimeDisplay } from '@src/contexts/timers/main/MainTimeDisplayProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import React, { useEffect } from 'react';

const RemotePublisher = () => {
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

export default RemotePublisher;
