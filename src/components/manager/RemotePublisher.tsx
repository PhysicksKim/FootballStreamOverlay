import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
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
  // TODO : 모든 ScoreBoard 변화 사항들을 파악해서 STOMP 메세지 맵핑해야함
  // 주어진 추가시간, 추가시간 show/hide, 메인/추가 타이머 이벤트들,
  // 팀 속성(코드, 이름, 점수, 유니폼, 팀폰트색), 대회 이름, 글로벌 폰트
  const { eventEmitterRef, publishMessage } = useRemoteClient();
  const { timer: mainTimer } = useMainTimerManager();
  const { timer: injuryTimer } = useInjuryTimerManager();
  const { teamA } = useTeamA();
  const { teamB } = useTeamB();
  const { teamAStyle } = useTeamAStyle();
  const { teamBStyle } = useTeamBStyle();

  const [remoteControlMsg, setRemoteControlMsg] = useState<
    RemoteChannelMsg | undefined
  >();
  const remoteMsgRef = useRef<RemoteChannelMsg | undefined>(remoteControlMsg);

  // TODO : 모든 state 보내는 게 아니라, 변경된 state만 보내도록 수정하자.
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
    setRemoteControlMsg(pubState);
  }, [teamA.score, teamB.score, givenInjuryTime]);

  useEffect(() => {
    remoteMsgRef.current = remoteControlMsg;
  }, [remoteControlMsg]);

  useEffect(() => {
    eventEmitterRef.current.removeAllListeners('publishRemoteControlMsg');
    setTimeout(() => {
      eventEmitterRef.current.on('publishRemoteControlMsg', () => {
        console.log('eventEmitter [publishRemoteControlMsg] Called');
        console.log('remoteMsgRef.current :: ', remoteMsgRef.current);
        publishMessage(remoteMsgRef.current);
      });
    }, 300);
  }, []);

  return (
    <>
      <div className='remote-publisher-component'></div>
    </>
  );
};

export default RemotePublisher;
