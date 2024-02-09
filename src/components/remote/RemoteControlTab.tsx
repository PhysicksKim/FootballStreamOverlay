import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@styles/remote/RemoteTab.scss';
import { useStompControlClient } from '@src/contexts/stomp/StompControlClientContext';
import { ConnectStatus } from '@src/types/stompTypes';

const RemoteControlTab = () => {
  const {
    clientRef,
    remotePubInfo,
    isConnected,
    controlMsgToPub,
    setControlMsgToPub,
  } = useStompControlClient();

  const [serverStatus, setServerStatus] = useState(false);
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

  // 백엔드 서버 연결 테스트
  const serverCheckCb = () =>
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

  const connectSocketHandler = () => {
    if (!clientRef.current) {
      console.error('clientRef is not set');
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

    if (isNotReadyWebsocket()) {
      console.log('websocket is not ready');
      return;
    }

    clientRef.current.publish({
      destination: '/app/remote.connect',
      body: JSON.stringify({ remoteCode: remotecodeInput }),
    });
  };

  const remoteControlTestHandler = () => {
    if (isNotReadyWebsocket()) {
      console.log('websocket is not ready');
      return;
    }

    clientRef.current.publish({
      destination: remotePubInfo.pubPath,
      body: JSON.stringify({ hello: 'RemoteCode based control test' }),
    });
  };

  return (
    <div className='setting-tab-container'>
      <h2>원격 컨트롤 탭</h2>
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
        <div>원격 연결</div>
        <input
          type='text'
          id='remote-connect-code-input'
          onChange={(e) => setRemotecodeInput(e.target.value)}
        />
        <button onClick={remoteConnectHandler}>연결</button>
        <button onClick={remoteControlTestHandler}>원격컨트롤테스트</button>
        <div>pubPath</div>
        <div> : [ {remotePubInfo.pubPath} ]</div>
        {/* <button onClick={}>테스트 메세지</button> */}
      </div>
      <div>
        <div>메세지 전송</div>
        <div>
          <div>scoreTeamA</div>
          <input
            id='team-a-score'
            type='number'
            placeholder='TeamA 점수'
          ></input>
        </div>
        <div>
          <div>scoreTeamB</div>
          <input
            id='team-b-score'
            type='number'
            placeholder='TeamB 점수'
          ></input>
        </div>
      </div>
    </div>
  );
};

export default RemoteControlTab;
