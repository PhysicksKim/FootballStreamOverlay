import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@styles/remote/RemoteTab.scss';
import { useStompBoardClient } from '@src/contexts/stomp/StompBoardClientContext';
import { ConnectStatus } from '@src/types/stompTypes';
import { useStompControlClient } from '@src/contexts/stomp/StompControlClientContext';

const RemoteReceiveTab = () => {
  const {
    clientRef,
    remoteSubInfo,
    isConnected: isBoardConnected,
    receiveRemoteMsg,
  } = useStompBoardClient();
  const { isConnected: isControlConnected } = useStompControlClient();

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

  // 백엔드 서버 연결 테스트
  const serverCheckCb = () => {
    axios
      .get('https://localhost:8083/server/status', { withCredentials: true })
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

  const helloHandler = () => {
    if (isNotReadyWebsocket()) return;

    clientRef.current.publish({
      destination: '/app/hello',
    });
  };

  const unSubHellos = () => {
    if (isNotReadyWebsocket()) return;

    clientRef.current.unsubscribe('hello');
  };

  const issueCodeHandler = () => {
    clientRef.current.publish({
      destination: '/app/board/remotecode.expire/' + remoteSubInfo.remoteCode,
    });
    clientRef.current.publish({
      destination: '/app/board/remotecode.issue',
    });
  };

  return (
    <div className='setting-tab-container'>
      <h2>리모트 수신 탭</h2>
      <div className='backend-status-box'>
        <div>백엔드 서버 상태</div>
        <button onClick={serverCheckCb}>서버 체크</button>
        <div className={serverStatus ? 'server-on' : 'server-off'}>
          {serverStatus ? '연결됨' : '끊어짐'}
        </div>
      </div>
      <div>
        <div>웹소켓 상태</div>
        <button onClick={connectSocketHandler}>연결</button>
        <button onClick={() => clientRef.current?.deactivate()}>
          연결종료
        </button>
        <div className='websocket-status'>{stompStatus}</div>
      </div>
      <div>
        <div>코드 발급</div>
        <button onClick={helloHandler}>hello</button>
        <button onClick={unSubHellos}>unsub hello</button>
        <button onClick={issueCodeHandler}>발급</button>
        <div>코드 값</div>
        <div> : [ {remoteSubInfo.remoteCode} ]</div>
        <div>subPath</div>
        <div> : [ {remoteSubInfo.subPath} ]</div>
      </div>
    </div>
  );
};

export default RemoteReceiveTab;
