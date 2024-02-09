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

// API 서버 환경변수 (개발/서비스 환경)
const apiUrl = process.env.API_URL;
const websocketUrl = process.env.WEBSOCKET_URL + '/ws';

export type StompClientRef = React.MutableRefObject<Client>;

// Provider 의 value 로 사용될 타입
export interface StompClient {
  clientRef: StompClientRef;
  remoteSubInfo: BoardRemoteConnectInfos;
  remotePubInfo: ControlRemoteConnectInfos;
  isConnected: boolean;
  remoteControlMsg: RemoteControlMsg; // TODO : 타입 정의 필요
}

const StompClientContext = createContext<StompClient | undefined>(undefined);

export const useStompClient = () => {
  const context = useContext(StompClientContext);
  if (!context) {
    throw new Error('useFont must be used within a StompClientProvider');
  }
  return context;
};

export interface BoardRemoteConnectInfos {
  remoteCode: string;
  subPath: string;
  subId: string;
}

export interface ControlRemoteConnectInfos {
  pubPath: string;
}

export interface RemoteControlMsg {
  code: number;
  message: string;
  data: { [key: string]: any };
}

/**
 * stompConfig 를 주입해줘야 합니다.
 * beforeConnect 옵션을 사용하여 사전 유저 정보 등록 http 요청을 성공한 뒤 activate 하도록 할 수 있습니다.
 */
export const StompClientProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const clientRef = useRef<Client>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [remoteSubInfo, setRemoteSubInfo] = useState<BoardRemoteConnectInfos>({
    remoteCode: '',
    subPath: '',
    subId: '',
  });
  const [remoteControlMsg, setRemoteControlMsg] = useState<RemoteControlMsg>();
  const [remotePubInfo, setRemotePubInfo] = useState<ControlRemoteConnectInfos>(
    {
      pubPath: '',
    },
  );

  // TODO : 타입 정의 필요

  const stompInitRef = useRef(new StompInitializer(clientRef));

  const subChannels = () => {
    stompInitRef.current.subscribeTestHello();
    stompInitRef.current.subscribeControlRemote(setRemotePubInfo);
    stompInitRef.current.subscribeScoreBoardRemote(
      setRemoteSubInfo,
      setRemoteControlMsg,
    );
  };

  const stompConfig: StompConfig = {
    brokerURL: websocketUrl,
    onConnect: () => {
      setIsConnected(true);
      subChannels();
    },
    onDisconnect: () => {
      setIsConnected(false);
    },
    onWebSocketError: (error) => {
      setIsConnected(false);
      clientRef.current.deactivate();
    },
    onStompError: (frame) => {
      setIsConnected(false);
      clientRef.current.deactivate();
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
    <StompClientContext.Provider
      value={{
        clientRef,
        remoteSubInfo,
        remotePubInfo,
        isConnected,
        remoteControlMsg,
      }}
    >
      {children}
    </StompClientContext.Provider>
  );
};
