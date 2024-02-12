import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import { Client, StompConfig } from '@stomp/stompjs';
import StompInitializer from './StompInitializer';
import {
  BoardRemoteConnectInfos,
  RemoteControlMsg,
  StompClientRef,
} from '@src/types/stompTypes';

// API 서버 환경변수 (개발/서비스 환경)
const apiUrl = process.env.API_URL;
const websocketUrl = process.env.WEBSOCKET_URL + '/ws';

// Provider 의 value 로 사용될 타입
export interface StompBoardClient {
  clientRef: StompClientRef;
  remoteSubInfo: BoardRemoteConnectInfos;
  isConnected: boolean;
  receiveRemoteMsg: RemoteControlMsg;
}

const StompBoardClientContext = createContext<StompBoardClient | undefined>(
  undefined,
);

/**
 * 원격 제어를 수신하는 측에서 사용하는 StompClient 입니다.
 * @returns StompBoardClient { clientRef, remoteSubInfo, isConnected, receiveRemoteMsg }
 * @throws Provider 외부에서 사용 시 에러
 */
export const useStompBoardClient = () => {
  const context = useContext(StompBoardClientContext);
  if (!context) {
    throw new Error('useStompBoardClient must be used within a Provider');
  }
  return context;
};

export const StompBoardClientProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const clientRef = useRef<Client>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [receiveRemoteMsg, setReceiveRemoteMsg] = useState<RemoteControlMsg>();
  const [remoteSubInfo, setRemoteSubInfo] = useState<BoardRemoteConnectInfos>({
    remoteCode: '',
    subPath: '',
    subId: '',
  });

  const stompInitRef = useRef(new StompInitializer(clientRef));

  const subChannels = () => {
    stompInitRef.current.subscribeTestHello();
    stompInitRef.current.subscribeScoreBoardRemote(
      setRemoteSubInfo,
      setReceiveRemoteMsg,
    );
  };

  const codeStateExpiredHandler = () => {
    setRemoteSubInfo({
      remoteCode: '',
      subPath: '',
      subId: '',
    });
  };

  const stompConfig: StompConfig = {
    brokerURL: websocketUrl,
    onConnect: () => {
      setIsConnected(true);
      subChannels();
    },
    onDisconnect: () => {
      setIsConnected(false);
      codeStateExpiredHandler();
    },
    onWebSocketError: (error) => {
      setIsConnected(false);
      clientRef.current.deactivate();
      codeStateExpiredHandler();
    },
    onStompError: (frame) => {
      setIsConnected(false);
      clientRef.current.deactivate();
      codeStateExpiredHandler();
    },
  };

  useEffect(() => {
    if (!clientRef.current) {
      try {
        clientRef.current = new Client(stompConfig);
      } catch (e) {
        console.log('STOMP connect ERROR', e);
      }
    }
    console.log('stompClient.current : ', clientRef.current);
  }, []);

  return (
    <StompBoardClientContext.Provider
      value={{
        clientRef,
        remoteSubInfo,
        isConnected,
        receiveRemoteMsg,
      }}
    >
      {children}
    </StompBoardClientContext.Provider>
  );
};
