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
  RemoteConnectInfos,
  RemoteControlMsg,
  StompClientRef,
} from '@src/types/stompTypes';
import EventEmitter from 'events';

// API 서버 환경변수 (개발/서비스 환경)
const apiUrl = process.env.API_URL;
const websocketUrl = process.env.WEBSOCKET_URL + '/ws';

// Provider 의 value 로 사용될 타입
export interface RemoteHostClient {
  clientRef: StompClientRef;
  remoteInfos: RemoteConnectInfos;
  isConnected: boolean;
  eventEmitterRef: React.MutableRefObject<EventEmitter>;
  receiveRemoteMsg: RemoteControlMsg;
  setReceiveRemoteMsg: React.Dispatch<React.SetStateAction<RemoteControlMsg>>;
  publishNowStates: () => boolean;
}

const RemoteHostClientContext = createContext<RemoteHostClient | undefined>(
  undefined,
);

/**
 * 원격 제어 코드를 발급하는 Host Client 입니다.
 * @returns RemoteHostClient { clientRef, remoteInfos, isConnected, receiveRemoteMsg, eventEmitterRef, publishNowStates }
 * @throws Provider 외부에서 사용 시 에러
 */
export const useRemoteHostClient = () => {
  const context = useContext(RemoteHostClientContext);
  if (!context) {
    throw new Error('useRemoteHostClient must be used within a Provider');
  }
  return context;
};

export const RemoteHostClientProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const clientRef = useRef<Client>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [receiveRemoteMsg, setReceiveRemoteMsg] = useState<RemoteControlMsg>();
  const [remoteInfos, setRemoteInfos] = useState<RemoteConnectInfos>({
    remoteCode: '',
    subPath: '',
    subId: '',
    pubPath: '',
  });

  const stompInitRef = useRef(new StompInitializer(clientRef));
  const eventEmitterRef = useRef(new EventEmitter());

  const subChannels = () => {
    stompInitRef.current.subscribeTestHello();

    // stompInitRef.current.subscribeScoreBoardRemote(
    //   setRemoteInfos,
    //   setReceiveRemoteMsg,
    // );
  };

  const remoteInfoExpiredHandler = () => {
    setRemoteInfos({
      remoteCode: '',
      subPath: '',
      subId: '',
      pubPath: '',
    });
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
      remoteInfoExpiredHandler();
      subChannels();

      eventEmitterRef.current.emit('connect');
    },
    onDisconnect: () => {
      setIsConnected(false);
      remoteInfoExpiredHandler();

      eventEmitterRef.current.emit('disconnect');
    },
    onWebSocketError: (error) => {
      setIsConnected(false);
      clientRef.current.deactivate();
      remoteInfoExpiredHandler();

      eventEmitterRef.current.emit('disconnect');
    },
    onStompError: (frame) => {
      setIsConnected(false);
      clientRef.current.deactivate();
      remoteInfoExpiredHandler();

      eventEmitterRef.current.emit('disconnect');
    },
    onWebSocketClose: () => {
      setIsConnected(false);
      clientRef.current.deactivate();
      remoteInfoExpiredHandler();

      eventEmitterRef.current.emit('disconnect');
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
    <RemoteHostClientContext.Provider
      value={{
        clientRef,
        remoteInfos,
        isConnected,
        eventEmitterRef,
        receiveRemoteMsg,
        setReceiveRemoteMsg,
        publishNowStates,
      }}
    >
      {children}
    </RemoteHostClientContext.Provider>
  );
};
