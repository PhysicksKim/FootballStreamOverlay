import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { RemoteControlMsg, RemoteTimerMsg } from '@src/types/stompTypes';
import { Time } from '@src/types/types';
import React, { useEffect, useState } from 'react';

export interface RemoteReceiverProps {
  isShowInjuryTimer: boolean;
  disappearInjuryTimer: () => void;
  showInjuryTimer: () => void;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

export type GetSyncedTimeType = (
  timerTime: Time,
  mil: number,
  deltaTime: number,
) => { min: number; sec: number; mil: number };

const RemoteReceiver: React.FC<RemoteReceiverProps> = ({
  isShowInjuryTimer,
  disappearInjuryTimer,
  showInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  const [isUpdateTimer, setIsUpdateTimer] = useState<boolean>(false);
  const [isUpdateMatchSettings, setIsUpdatePreSettings] =
    useState<boolean>(false);

  const {
    timer: mainTimer,
    startTimer: startMainTimer,
    pauseTimer: pauseMainTimer,
    setTimer: setMainTimer,
  } = useMainTimerManager();
  const {
    timer: injuryTimer,
    startTimer: startInjuryTimer,
    pauseTimer: pauseInjuryTimer,
    setTimer: setInjuryTimer,
  } = useInjuryTimerManager();

  const { updateTeamA } = useTeamA();
  const { updateTeamB } = useTeamB();
  const { updateTeamAStyle } = useTeamAStyle();
  const { updateTeamBStyle } = useTeamBStyle();

  const { remoteConrolMsg } = useRemoteClient();

  useEffect(() => {
    console.log('new Remote Messsage Received: ', remoteConrolMsg);
    updateStateByRemoteMsg(remoteConrolMsg);
  }, [remoteConrolMsg]);

  const updateStateByRemoteMsg = (remoteConrolMsg: RemoteControlMsg) => {
    if (!remoteConrolMsg || remoteConrolMsg.code !== 200) {
      console.log('Invalid Remote Control Message :: code is not 200');
      return;
    }

    switch (remoteConrolMsg.type) {
      case 'control':
        doControlMsg(remoteConrolMsg);
        break;
      case 'members':
        console.log("unExpected 'members' type message");
        break;
      default:
        console.log(
          'Unexpected Remote Control Message Type :: ',
          remoteConrolMsg.type,
        );
        break;
    }
  };

  const doControlMsg = (remoteConrolMsg: RemoteControlMsg) => {
    const data = remoteConrolMsg.data;
    if (!data) {
      console.log('Invalid Remote Control Message :: data is undefined');
      return;
    }

    const score = data.score;
    const givneInjury = data.givenInjury;

    updateTeamA('score', score.teamAScore);
    updateTeamB('score', score.teamBScore);
    updateGivenInjuryTime(givneInjury.givenInjuryTime);

    console.log('Remote Message Payload :: ', data);
  };

  return (
    <>
      <div className='remote-receiver-component'></div>
    </>
  );
};

export default RemoteReceiver;
