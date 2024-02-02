import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '@styles/settingtab/RemoteTab.scss';
import StompJs, { Client } from '@stomp/stompjs';

type WebSocketStatus = '연결시도' | '연결됨' | '끊어짐';

const RemoteTab = () => {
  const [serverStatus, setServerStatus] = useState(false);
  const [stompStatus, setStompStatus] = useState<WebSocketStatus>('연결시도');
  const [stompMessage, setStompMessage] = useState<string>('');
  const stompClient = useRef<StompJs.Client>();

  // 백엔드 서버 연결 테스트
  const serverCheckCb = () =>
    axios
      .get('https://localhost:8083/api/test')
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
  }, []);

  // STOMP 웹소켓 연결
  useEffect(() => {
    try {
      const url = 'wss://localhost:8083/ws';
      stompClient.current = new Client({
        brokerURL: url,
        connectHeaders: {
          recipientId: 'gyechunhoe',
        },
        onConnect: () => {
          console.log('stomp connected');
          setStompStatus('연결됨');
          console.log('onConnect');
          stompClient.current.subscribe('/topic/greetings', (message: any) => {
            console.log('stomp message : ', message);
            setStompMessage(JSON.stringify(message)); // 메시지 내용 업데이트
          });
        },
        onDisconnect: () => {
          console.log('stomp disconnected');
          setStompStatus('끊어짐');
        },
        onWebSocketError: (error) => {
          console.error('Error with websocket', error);
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
      });
      stompClient.current.activate();
      stompClient.current.subscribe('/topic/greetings', (message: any) => {
        console.log('stomp message : ', message);
        const greeting = JSON.parse(message.body); // JSON 파싱
        setStompMessage(greeting.content); // 메시지 내용 업데이트
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const sendMessage = () => {
    stompClient.current.publish({
      destination: '/app/hello',
      body: JSON.stringify({ name: 'gyechunhoe' }),
    });
  };

  return (
    <div className='setting-tab-container'>
      <div className='backend-status-box'>
        <div>백엔드 서버 상태</div>
        <div className={serverStatus ? 'server-on' : 'server-off'}>
          {serverStatus ? '연결됨' : '끊어짐'}
        </div>
        <div>웹소켓 연결</div>
        <div>상태 : {stompStatus}</div>
        <button onClick={sendMessage}>메시지 보내기</button>
        <div>메세지 : {stompMessage}</div>
      </div>
    </div>
  );
};

export default RemoteTab;
