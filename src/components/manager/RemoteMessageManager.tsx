import { useRemoteHostClient } from '@src/contexts/stomp/RemoteHostClientContext';
import { useStompMemberClient } from '@src/contexts/stomp/RemoteMemberClientContext';
import React, { useEffect } from 'react';
import RemoteMessagePublisher from './RemoteMessagePublisher';
import RemoteMessageSubscriber from './RemoteMessageSubscriber';

export interface RemoteMessageManagerProps {
  givenInjuryTime: number;
  matchName: string;
  disappearInjuryTimer: () => void;
  showInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const RemoteMessageManager: React.FC<RemoteMessageManagerProps> = ({
  givenInjuryTime,
  disappearInjuryTimer,
  showInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  matchName,
  updateMatchName,
}) => {
  const { isConnected: isBoardConnected } = useRemoteHostClient();
  const { isConnected: isControlConnected } = useStompMemberClient();

  // TODO : 모든 ScoreBoard 변화 사항들을 파악해서 STOMP 메세지 맵핑해야함
  // 주어진 추가시간, 추가시간 show/hide, 메인/추가 타이머 이벤트들,
  // 팀 속성(코드, 이름, 점수, 유니폼, 팀폰트색), 대회 이름, 글로벌 폰트

  return (
    <>
      <div>RemoteMessageManager</div>
      {isBoardConnected != isControlConnected ? ( // 둘 중 하나만 연결되어야 함
        <>
          {isControlConnected && <RemoteMessagePublisher />}
          {isBoardConnected && <RemoteMessageSubscriber />}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default RemoteMessageManager;
