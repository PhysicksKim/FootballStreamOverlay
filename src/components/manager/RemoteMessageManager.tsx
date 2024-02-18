import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import { useTeamFontColor } from '@src/contexts/TeamFontColorContext';
import { v4 as uuidv4 } from 'uuid';
import { RemoteControlMsg } from '@src/types/stompTypes';
import { TimerState } from '@src/hooks/useTimerHook';

export interface RemoteMessageManagerProps {
  givenInjuryTime: number;
  matchName: string;
  disappearInjuryTimer: () => void;
  showInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

type Time = {
  min: number;
  sec: number;
};

const RemoteMessageManager: React.FC<RemoteMessageManagerProps> = ({
  givenInjuryTime,
  isShowInjuryTimer,
  matchName,
  disappearInjuryTimer,
  showInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
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
        },
        injuryTimer: {
          time: {
            min: injuryTimer.time.min,
            sec: injuryTimer.time.sec,
          },
          isRunning: injuryTimer.isRunning,
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
  }, [mainTimer.time]);

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

  return (
    <>
      {/* <div>RemoteMessageManager</div>
      {isBoardConnected != isControlConnected ? ( // 둘 중 하나만 연결되어야 함
        <>
          {isControlConnected && <RemoteReceiver />}
          {isBoardConnected && <RemotePublisher />}
        </>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default RemoteMessageManager;
