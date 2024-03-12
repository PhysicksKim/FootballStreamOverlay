import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { ControlChannelMsg } from '@src/types/stompTypes';
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
  const { updateTeamA } = useTeamA();
  const { updateTeamB } = useTeamB();
  const { setOnReceiveControlMessage } = useRemoteClient();

  useEffect(() => {
    setOnReceiveControlMessage(handleControlMessage);
  }, []);

  const handleControlMessage = (remoteControlMsg: ControlChannelMsg) => {
    const { data, type } = remoteControlMsg;
    if (isNotValidMessage(data, type)) {
      return;
    }

    const score = data.score;
    const givneInjury = data.givenInjury;
    updateTeamA('score', score.teamAScore);
    updateTeamB('score', score.teamBScore);
    updateGivenInjuryTime(givneInjury.givenInjuryTime);
  };

  const isNotValidMessage = (data: any, type: any) => {
    return (
      type !== 'control' ||
      'score' in data === false ||
      'givenInjury' in data === false
    );
  };

  return (
    <>
      <div className='remote-receiver-component'></div>
    </>
  );
};

export default RemoteReceiver;
