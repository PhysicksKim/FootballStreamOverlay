import { useRemoteHostClient } from '@src/contexts/stomp/RemoteHostClientContext';
import { useStompMemberClient } from '@src/contexts/stomp/RemoteMemberClientContext';
import React, { useState, useEffect } from 'react';

const RemoteMessagePublisher = () => {
  // const {
  //   clientRef: boardClientRef,
  //   remoteSubInfo,
  //   isConnected: isBoardConnected,
  //   receiveRemoteMsg,
  // } = useStompBoardClient();
  const {
    clientRef: controlClientRef,
    remotePubInfo,
    isConnected: isControlConnected,
    publishNowStates,
    eventEmitterRef,
  } = useStompMemberClient();

  // TODO : state 변화에 따라서 메세지 발행 해야함

  return <div>RemoteMessagePublisher</div>;
};

export default RemoteMessagePublisher;
