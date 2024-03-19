import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { RemoteChannelMsg } from '@src/types/stompTypes';
import React, { useEffect, useRef, useState } from 'react';

export interface RemotePublisherProps {
  givenInjuryTime: number;
  isShowInjuryTimer: boolean;
  matchName: string;
}

const RemotePublisher: React.FC<RemotePublisherProps> = ({
  givenInjuryTime,
  isShowInjuryTimer,
  matchName,
}) => {
  const { teamA } = useTeamA();
  const { teamB } = useTeamB();

  const { setRemotePubData } = useRemoteClient();

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
          givenInjuryTime: givenInjuryTime,
        },
      },
    };
    setRemotePubData(pubState);
  }, [teamA.score, teamB.score, givenInjuryTime]);

  return (
    <>
      <div className='remote-publisher-component'></div>
    </>
  );
};

export default RemotePublisher;
