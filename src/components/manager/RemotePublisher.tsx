import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { RemoteControlMsg } from '@src/types/stompTypes';
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
    RemoteControlMsg | undefined
  >();
  const remoteMsgRef = useRef<RemoteControlMsg | undefined>(remoteControlMsg);

  useEffect(() => {
    const pubState: RemoteControlMsg = {
      code: 200,
      message: 'test message send',
      metadata: {
        date: new Date(),
      },
      data: {
        mainTimer: {
          time: {
            min: mainTimer.time.min,
            sec: mainTimer.time.sec,
          },
          isRunning: mainTimer.isRunning,
          milliseconds: mainTimer.mils.milliseconds,
        },
        injuryTimer: {
          time: {
            min: injuryTimer.time.min,
            sec: injuryTimer.time.sec,
          },
          isRunning: injuryTimer.isRunning,
          milliseconds: injuryTimer.mils.milliseconds,
        },
        injuryInfo: {
          givenInjuryTime,
          isShowInjuryTimer,
        },
        matchName,
        teamA,
        teamB,
        teamAStyle,
        teamBStyle,
      },
    };
    setRemoteControlMsg(pubState);
  }, [mainTimer.time, injuryTimer.time]);

  useEffect(() => {
    remoteMsgRef.current = remoteControlMsg;
  }, [remoteControlMsg]);

  useEffect(() => {
    eventEmitterRef.current.on('publishRemoteControlMsg', () => {
      console.log('eventEmitter [publishRemoteControlMsg] Called');
      console.log('remoteMsgRef.current :: ', remoteMsgRef.current);
      publishMessage(remoteMsgRef.current);
    });
  }, []);

  return <></>;
};

export default RemotePublisher;
