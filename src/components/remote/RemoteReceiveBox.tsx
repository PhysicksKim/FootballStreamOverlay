import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRemoteHostClient } from '@src/contexts/stomp/RemoteHostClientContext';
import { ConnectStatus } from '@src/types/stompTypes';
import { useStompMemberClient } from '@src/contexts/stomp/RemoteMemberClientContext';

import '@styles/remote/RemoteReceiveBox.scss';

const RemoteReceiveBox = () => {
  const {
    clientRef,
    remoteSubInfo,
    isConnected: isBoardConnected,
    receiveRemoteMsg,
  } = useRemoteHostClient();
  const { isConnected: isControlConnected } = useStompMemberClient();

  const [serverStatus, setServerStatus] = useState(false);
  const [stompStatus, setStompStatus] = useState<ConnectStatus>('연결됨');

  useEffect(() => {
    if (isBoardConnected) {
      setStompStatus('연결됨');
    } else {
      setStompStatus('끊어짐');
    }
  }, [isBoardConnected]);

  useEffect(() => {
    console.log('receiveRemoteMsg : ', receiveRemoteMsg);
  }, [receiveRemoteMsg]);

  const isNotReadyWebsocket = () => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.log('clientRef is not set');
      return true;
    }
    return false;
  };

  const connectSocketHandler = () => {
    if (!clientRef.current) {
      console.error('clientRef is not set');
      return;
    }
    if (isControlConnected) {
      console.log(
        'controlClient is already connected. please disconnect controlClient first.',
      );
      return;
    }

    if (!clientRef.current.connected) {
      clientRef.current.activate();
    }
  };

  const issueCodeHandler = () => {
    clientRef.current.publish({
      destination: '/app/board/remotecode.expire/' + remoteSubInfo.remoteCode,
    });
    clientRef.current.publish({
      destination: '/app/board/remotecode.issue',
    });
  };

  const disconnectHandler = () => {
    if (isNotReadyWebsocket()) return;

    clientRef.current.deactivate();
  };

  return (
    <div className='remote-receive-tab-container'>
      <h2>원격 수신</h2>
      <div className='group-box'>
        <div>웹소켓 상태</div>
        <button onClick={connectSocketHandler}>연결</button>
        <button onClick={disconnectHandler}>연결종료</button>
        <div className='websocket-status'>{stompStatus}</div>
      </div>
      <div className='group-box'>
        <div>코드 발급</div>
        <button onClick={issueCodeHandler}>발급</button>
      </div>
      <div className='group-box'>
        <div>코드 값</div>
        <div> : [ {remoteSubInfo.remoteCode} ]</div>
      </div>
      <div className='group-box'>
        <div>subPath</div>
        <div> : [ {remoteSubInfo.subPath} ]</div>
      </div>
    </div>
  );
};

export default RemoteReceiveBox;
