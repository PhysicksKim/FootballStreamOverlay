import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { RootState } from '@src/redux/Store';
import { RemoteChannelMsg } from '@src/types/stompTypes';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export interface RemotePublisherProps {
  matchName: string;
}

const RemotePublisher: React.FC<RemotePublisherProps> = ({ matchName }) => {
  const { teamA } = useTeamA();
  const { teamB } = useTeamB();

  const { setRemotePubData } = useRemoteClient();

  const injuryTimeInfo = useSelector(
    (state: RootState) => state.injuryTimeInfo,
  );

  useEffect(() => {
    const pubState: RemoteChannelMsg = {
      code: 200,
      type: 'control',
      message: 'test message send',
      metadata: {
        date: new Date(),
      },
      data: {
        score: {
          teamAScore: teamA.score,
          teamBScore: teamB.score,
        },
        givenInjury: {
          givenInjuryTime: injuryTimeInfo.givenInjuryTime,
        },
        uniform: {
          teamAUniform: teamA.uniform,
          teamBUniform: teamB.uniform,
        },
      },
    };
    setRemotePubData(pubState);
  }, [
    teamA.score,
    teamB.score,
    injuryTimeInfo.givenInjuryTime,
    teamA.uniform,
    teamB.uniform,
  ]);

  return (
    <>
      <div className='remote-publisher-component'></div>
    </>
  );
};

export default RemotePublisher;
