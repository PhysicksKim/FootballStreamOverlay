import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { ControlChannelMsg } from '@src/types/stompTypes';
import { Time } from '@src/types/types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateGivenInjuryTime } from '@src/redux/slices/InjuryTimeInfoSlice';

export interface RemoteReceiverProps {
  updateMatchName: (matchName: string) => void;
}

export type GetSyncedTimeType = (
  timerTime: Time,
  mil: number,
  deltaTime: number,
) => { min: number; sec: number; mil: number };

const RemoteReceiver: React.FC<RemoteReceiverProps> = ({ updateMatchName }) => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();
  const { setOnReceiveControlMessage } = useRemoteClient();

  useEffect(() => {
    setOnReceiveControlMessage(handleControlMessage);
  }, []);

  const dispatch = useDispatch();

  const handleControlMessage = (remoteControlMsg: ControlChannelMsg) => {
    const { data, type } = remoteControlMsg;
    if (isNotValidMessage(data, type)) {
      return;
    }

    const score = data.score;
    const givneInjury = data.givenInjury;
    const uniform = data.uniform;
    updateTeamA('uniform', uniform.teamAUniform);
    updateTeamB('uniform', uniform.teamBUniform);
    updateTeamA('score', score.teamAScore);
    updateTeamB('score', score.teamBScore);
    dispatch(updateGivenInjuryTime(givneInjury.givenInjuryTime));
  };

  const isNotValidMessage = (data: any, type: any) => {
    return (
      type !== 'control' ||
      'score' in data === false ||
      'givenInjury' in data === false ||
      'uniform' in data === false
    );
  };

  return (
    <>
      <div className='remote-receiver-component'></div>
    </>
  );
};

export default RemoteReceiver;
