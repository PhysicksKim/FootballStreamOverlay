import React, { useEffect } from 'react';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import RemotePublisher from './RemotePublisher';
import RemoteReceiver from './RemoteReceiver';

export interface RemoteMessageManagerProps {
  givenInjuryTime: number;
  isShowInjuryTimer: boolean;
  matchName: string;
  disappearInjuryTimer: () => void;
  showInjuryTimer: () => void;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const RemoteMessageManager: React.FC<RemoteMessageManagerProps> = ({
  givenInjuryTime,
  isShowInjuryTimer,
  matchName,
  disappearInjuryTimer,
  showInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  const {
    clientRef,
    remoteInfos,
    remoteCode,
    isConnected,
    eventEmitterRef,
    remoteConrolMsg,
    publishMessage,
    emitRemoteControlMsg,
    hostClient,
    memberClient,
    doAutoReconnect,
    autoRemote,
  } = useRemoteClient();

  useEffect(() => {
    try {
      console.log('autoRemote.isAutoRemote', autoRemote.isAutoRemote);
      if (autoRemote.isAutoRemote) {
        doAutoReconnect(autoRemote.nickname || 'noNicknameFound');
      }
    } catch (e) {
      console.log('error', e);
    }
  }, []);

  return (
    <>
      <></>
      {isConnected ? (
        <>
          <RemotePublisher
            givenInjuryTime={givenInjuryTime}
            isShowInjuryTimer={isShowInjuryTimer}
            matchName={matchName}
          />
          <RemoteReceiver
            isShowInjuryTimer={isShowInjuryTimer}
            disappearInjuryTimer={disappearInjuryTimer}
            showInjuryTimer={showInjuryTimer}
            updateGivenInjuryTime={updateGivenInjuryTime}
            updateMatchName={updateMatchName}
          />
        </>
      ) : null}
    </>
  );
};

export default RemoteMessageManager;
