import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '@styles/settingtab/RemoteTab.scss';

type WebSocketStatus = '연결시도' | '연결됨' | '끊어짐';

const RemoteTab = () => {
  const [serverStatus, setServerStatus] = useState(false);
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('연결시도'); // WebSocket 연결 상태
  const [messages, setMessages] = useState<string[]>([]);
  const webSocket = useRef<WebSocket | null>(null);

  // 백엔드 서버 연결 테스트
  const serverCheckCb = () =>
    axios
      .get('https://localhost:8443/api/test')
      .then((res) => {
        console.log('axios get : ', res.data);
        setServerStatus(true);
      })
      .catch((err) => {
        console.log('axios get error : ', err);
        setServerStatus(false);
      });

  // 2초마다 백엔드 연결 확인
  useEffect(() => {
    serverCheckCb();
    const serverCheckInterval = setInterval(serverCheckCb, 2000);
    return () => clearInterval(serverCheckInterval);
  });

  const webSocketInit = () => {
    webSocket.current = new WebSocket('wss://localhost:8443/ws-scoreboard');
    webSocket.current.onopen = () => {
      console.log('WebSocket 연결!');
      setWsStatus('연결됨');
    };
    webSocket.current.onclose = (error) => {
      console.log(error);
      setWsStatus('끊어짐');
    };
    webSocket.current.onerror = (error) => {
      console.log(error);
      setWsStatus('끊어짐');
    };
    webSocket.current.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      setMessages((prev) => [...prev, event.data]);
    };
  };

  useEffect(() => {
    webSocketInit();

    return () => {
      webSocket.current?.close();
    };
  }, []);

  // TODO : 메세지를 받았을 때 처할 방법 만들어야 함.
  /*
  현재 예상되는 메세지 타입들    
  1. type : control => board control 메세지  
  2. type : error => 에러 메세지  
  3. type : setting => 세팅 관련 메세지  
  4. type : system => 시스템 메세지

  컨트롤에는 a) 스코어 +- b) 주어진 추가시간 c) 유니폼 색상변경  를 가능하도록 해야함.  
  에러 메세지는 일단 타입만 두고 나중에 추가.  
  세팅 메세지는 연결 관련 메세지들. 
  시스템 메세지는 원격 컨트롤 상대의 연결 끊어짐 등 메세지들. 
  */

  const sendMessage = (message: string) => {
    if (webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(message);
    }
  };

  return (
    <div className='setting-tab-container'>
      <div className='backend-status-box'>
        <div>백엔드 서버 상태</div>
        <div className={serverStatus ? 'server-on' : 'server-off'}>
          {serverStatus ? '연결됨' : '끊어짐'}
        </div>
        <div>웹 소켓 상태</div>
        <div
          className={
            wsStatus === '연결시도'
              ? 'ws-try'
              : wsStatus === '연결됨'
              ? 'ws-connect'
              : 'ws-disconnect'
          }
        >
          {wsStatus}
        </div>
      </div>
      <div>
        {messages?.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
};

export default RemoteTab;
