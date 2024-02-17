import React, { useEffect, useReducer, useRef } from 'react';
import RemoteReceiver from './RemoteMessagePublisher';
import RemotePublisher from './RemoteMessageSubscriber';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
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
  disappearInjuryTimer,
  showInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  matchName,
  updateMatchName,
}) => {
  // TODO : 모든 ScoreBoard 변화 사항들을 파악해서 STOMP 메세지 맵핑해야함
  // 주어진 추가시간, 추가시간 show/hide, 메인/추가 타이머 이벤트들,
  // 팀 속성(코드, 이름, 점수, 유니폼, 팀폰트색), 대회 이름, 글로벌 폰트
  const { eventEmitterRef } = useRemoteClient();
  const { timer } = useMainTimerManager();
  const timeRef = useRef<Time>({ min: 0, sec: 0 });

  useEffect(() => {
    console.log('time changed', timer.time);
    timeRef.current = timer.time;
  }, [timer.time]);

  useEffect(() => {
    eventEmitterRef.current.on('publishRemoteControlMsg', () => {
      console.log('eventEmitter [publishRemoteControlMsg] Called');
      console.log('timeRef.current', timeRef.current);
    });
  }, [eventEmitterRef.current]);

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
