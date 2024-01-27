import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '@styles/settingtab/SettingTab.scss';

type WebSocketStatus = '연결시도' | '연결됨' | '끊어짐';

const SettingTab = () => {
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

  useEffect(() => {
    webSocket.current = new WebSocket('wss://localhost:8443/myws');
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
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

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

export default SettingTab;
