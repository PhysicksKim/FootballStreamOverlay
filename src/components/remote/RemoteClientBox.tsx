import React, { useEffect, useState } from 'react';
import { ConnectStatus } from '@src/types/stompTypes';

import '@styles/remote/RemoteHostBox.scss';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

const RemoteClientBox = () => {
  const {
    clientRef,
    remoteInfos,
    remoteCode,
    isConnected,
    hostClient,
    memberClient,
  } = useRemoteClient();

  const [stompStatus, setStompStatus] = useState<ConnectStatus>('연결됨');
  const [remotecodeInput, setRemotecodeInput] = useState('');

  useEffect(() => {
    if (isConnected) {
      setStompStatus('연결됨');
    } else {
      setStompStatus('끊어짐');
    }
  }, [isConnected]);

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
    if (isConnected) {
      console.log('client is already connected. please disconnect first.');
      return;
    }

    if (!clientRef.current.connected) {
      clientRef.current.activate();
    }
  };

  const disconnectHandler = () => {
    if (isNotReadyWebsocket()) return;

    clientRef.current.deactivate();
  };

  // #region HostClient
  const issueCodeHandler = () => {
    if (isNotReadyWebsocket()) return;

    hostClient.connectAsHost();
  };

  // #region MemberClient
  const codeConnectHandler = () => {
    if (!remotecodeInput) {
      console.log('input is empty');
      return;
    }

    memberClient.connectAsMember(remotecodeInput);
  };

  return (
    <div className='remote-receive-tab-container'>
      <div className='websocket-connect-box'>
        <h2>원격 수신</h2>
        <div>웹소켓 상태</div>
        <button onClick={connectSocketHandler}>연결</button>
        <button onClick={disconnectHandler}>연결종료</button>
        <div className='websocket-status'>{stompStatus}</div>
      </div>
      <div className='remote-host-box'>
        <div className='group-box'>
          <div>코드 발급</div>
          <button onClick={issueCodeHandler}>발급</button>
        </div>
      </div>
      <div className='remote-member-box'>
        <div className='group-box'>
          <div>코드 연결</div>
          <input
            type='text'
            id='remote-connect-code-input'
            onChange={(e) => setRemotecodeInput(e.target.value)}
          />
          <button onClick={codeConnectHandler}>연결</button>
        </div>
      </div>
      <div className='remote-infos-box'>
        <div className='group-box'>
          <div>코드 값</div>
          <div> : [ {remoteCode} ]</div>
        </div>
        <div className='group-box'>
          <div>subPath</div>
          <div> : [ {remoteInfos.subPath} ]</div>
        </div>
        <div className='group-box'>
          <div>pubPath</div>
          <div> : [ {remoteInfos.pubPath} ]</div>
        </div>
      </div>
    </div>
  );
};

export default RemoteClientBox;
