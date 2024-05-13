import React, { useEffect } from 'react';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import RemotePublisher from './RemotePublisher';
import RemoteReceiver from './RemoteReceiver';

export interface RemoteMessageManagerProps {
  // givenInjuryTime: number;
  // isShowInjuryTimer: boolean;
  matchName: string;
  // disappearInjuryTimer: () => void;
  // showInjuryTimer: () => void;
  // updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const RemoteMessageManager: React.FC<RemoteMessageManagerProps> = ({
  // givenInjuryTime,
  // isShowInjuryTimer,
  matchName,
  // disappearInjuryTimer,
  // showInjuryTimer,
  // updateGivenInjuryTime,
  updateMatchName,
}) => {
  const { clientRef, initStompClient } = useRemoteClient();

  useEffect(() => {
    try {
      initStompClient();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <>
      <></>
      {clientRef.current?.connected ? (
        <>
          <RemotePublisher matchName={matchName} />
          <RemoteReceiver
            // isShowInjuryTimer={isShowInjuryTimer}
            // disappearInjuryTimer={disappearInjuryTimer}
            // showInjuryTimer={showInjuryTimer}
            // updateGivenInjuryTime={updateGivenInjuryTime}
            updateMatchName={updateMatchName}
          />
        </>
      ) : null}
    </>
  );
};

export default RemoteMessageManager;
