import { useStompBoardClient } from '@src/contexts/stomp/StompBoardClientContext';
import { useStompControlClient } from '@src/contexts/stomp/StompControlClientContext';
import React from 'react';

const RemoteMessagePublisher = () => {
  const {
    clientRef: boardClientRef,
    remoteSubInfo,
    isConnected: isBoardConnected,
    receiveRemoteMsg,
  } = useStompBoardClient();
  const {
    clientRef: controlClientRef,
    remotePubInfo,
    isConnected: isControlConnected,
    controlMsgToPub,
    setControlMsgToPub,
  } = useStompControlClient();

  // TODO : state 변화에 따라서 메세지 발행 해야함

  return <div>RemoteMessagePublisher</div>;
};

export default RemoteMessagePublisher;
