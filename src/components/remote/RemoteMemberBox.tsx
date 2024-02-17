import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRemoteMemberClient } from '@src/contexts/stomp/RemoteMemberClientContext';
import { ConnectStatus } from '@src/types/stompTypes';
import { useRemoteHostClient } from '@src/contexts/stomp/RemoteHostClientContext';

import '@styles/remote/RemoteMemberBox.scss';

const RemoteControlBox = () => {
  const {
    clientRef,
    remoteInfos,
    isConnected: isControlConnected,
    eventEmitterRef,
    remoteControlMsg,
    publishMessage,
    pubRemoteConnect,
    setRemoteCode,
  } = useRemoteMemberClient();
  const { isConnected: isBoardConnected } = useRemoteHostClient();

  const [serverStatus, setServerStatus] = useState(false);
  const [stompStatus, setStompStatus] = useState<ConnectStatus>('연결됨');
  const [remotecodeInput, setRemotecodeInput] = useState('');

  useEffect(() => {
    if (isControlConnected) {
      setStompStatus('연결됨');
    } else {
      setStompStatus('끊어짐');
    }
  }, [isControlConnected]);

  const isNotReadyWebsocket = () => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.log('clientRef is not set');
      return true;
    }
    return false;
  };

  // 백엔드 서버 연결 테스트
  const serverCheckCb = () => {
    axios
      .get('https://localhost:8083/server/status', {
        withCredentials: true,
      })
      .then((res) => {
        console.log('axios get : ', res.data);
        console.log('axios headers : ', res.headers);
        setServerStatus(true);
      })
      .catch((err) => {
        console.log('axios get error : ', err);
        setServerStatus(false);
      });
  };

  const connectSocketHandler = () => {
    if (!clientRef.current) {
      console.error('clientRef is not set');
      return;
    }
    if (isBoardConnected) {
      console.log(
        'boardClient is already connected. please disconnect boardClient first.',
      );
      return;
    }

    if (!clientRef.current.connected) {
      clientRef.current.activate();
    }
  };

  const remoteConnectHandler = () => {
    if (!remotecodeInput) {
      console.log('input is empty');
      return;
    }
    if (isBoardConnected) {
      console.log(
        'boardClient is already connected. please disconnect boardClient first.',
      );
      return;
    }

    setRemoteCode(remotecodeInput);
    pubRemoteConnect(remotecodeInput);
  };

  const disconnectHandler = () => {
    if (isNotReadyWebsocket()) return;

    clientRef.current.deactivate();
  };

  return (
    <div className='remote-control-tab-container'>
      <h2>원격 컨트롤 탭</h2>
      <div className='group-box'>
        <div>웹소켓 상태</div>
        <button onClick={connectSocketHandler}>연결</button>
        <button onClick={disconnectHandler}>연결종료</button>
        <div className='websocket-status'>{stompStatus}</div>
      </div>
      <div className='group-box'>
        <div>코드 연결</div>
        <input
          type='text'
          id='remote-connect-code-input'
          onChange={(e) => setRemotecodeInput(e.target.value)}
        />
        <button onClick={remoteConnectHandler}>연결</button>
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
  );
};

export default RemoteControlBox;
