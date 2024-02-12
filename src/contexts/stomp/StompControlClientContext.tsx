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
  ControlRemoteConnectInfos,
  StompClientRef,
} from '@src/types/stompTypes';
import EventEmitter from 'events';

// API 서버 환경변수 (개발/서비스 환경)
const apiUrl = process.env.API_URL;
const websocketUrl = process.env.WEBSOCKET_URL + '/ws';

// Provider 의 value 로 사용될 타입
export interface StompControlClient {
  clientRef: StompClientRef;
  remotePubInfo: ControlRemoteConnectInfos;
  isConnected: boolean;
  publishNowStates: () => boolean;
  eventEmitterRef: React.MutableRefObject<EventEmitter>;
}

const StompControlClientContext = createContext<StompControlClient | undefined>(
  undefined,
);

/**
 * 원격 제어를 발신하는 측에서 사용하는 StompClient 입니다.
 * @returns StompControlClient { clientRef, remotePubInfo, isConnected, publishNowStates, eventEmitterRef }
 * @throws Provider 외부에서 사용 시 에러
 */
export const useStompControlClient = () => {
  const context = useContext(StompControlClientContext);
  if (!context) {
    throw new Error('useStompControlClient must be used within a Provider');
  }
  return context;
};

export const StompControlClientProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const clientRef = useRef<Client>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // const [controlMsgToPub, setControlMsgToPub] = useState<RemoteControlMsg>();
  const [remotePubInfo, setRemotePubInfo] = useState<ControlRemoteConnectInfos>(
    {
      pubPath: '',
    },
  );

  const stompInitRef = useRef(new StompInitializer(clientRef));
  const eventEmitterRef = useRef(new EventEmitter());

  const subChannels = () => {
    stompInitRef.current.subscribeTestHello();
    stompInitRef.current.subscribeControlRemote(setRemotePubInfo);
  };

  /**
   * `publishControlMsg` 이벤트를 발생시킵니다.
   * eventEmitter.on('publishControlMsg', handler); 를 통해서 원격 제어 메세지를 전송하는 handler 를 작성합니다.
   * @returns `true` if event had listened.
   */
  const publishNowStates = () => {
    return eventEmitterRef.current.emit('publishControlMsg');
  };

  const stompConfig: StompConfig = {
    brokerURL: websocketUrl,
    onConnect: () => {
      setIsConnected(true);
      subChannels();
      setRemotePubInfo({
        pubPath: '',
      });
      eventEmitterRef.current.emit('afterConnect');
    },
    onDisconnect: () => {
      setRemotePubInfo({
        pubPath: '',
      });
      setIsConnected(false);
    },
    onWebSocketError: (error) => {
      setIsConnected(false);
      setRemotePubInfo({
        pubPath: '',
      });
      clientRef.current.deactivate();
    },
    onStompError: (frame) => {
      setIsConnected(false);
      setRemotePubInfo({
        pubPath: '',
      });
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
    <StompControlClientContext.Provider
      value={{
        clientRef,
        remotePubInfo,
        isConnected,
        publishNowStates,
        eventEmitterRef,
      }}
    >
      {children}
    </StompControlClientContext.Provider>
  );
};
