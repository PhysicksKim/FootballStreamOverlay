import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import { Client, StompConfig, IMessage } from '@stomp/stompjs';
import {
  RemoteConnectInfos,
  RemoteConnectMsg,
  RemoteControlMsg,
  StompClientRef,
} from '@src/types/stompTypes';
import EventEmitter from 'events';
import StompInitializer from './StompInitializer';

// API 서버 환경변수 (개발/서비스 환경)
const apiUrl = process.env.API_URL;
const websocketUrl = process.env.WEBSOCKET_URL + '/ws';

// Provider 의 value 로 사용될 타입
export interface RemoteMemeberClient {
  clientRef: StompClientRef;
  remoteInfos: RemoteConnectInfos;
  isConnected: boolean;
  eventEmitterRef: React.MutableRefObject<EventEmitter>;
  remoteControlMsg: RemoteControlMsg;
  publishMessage: (pubStates: RemoteControlMsg) => void;
  pubRemoteConnect: (remoteCode: string) => void;
  setRemoteCode: (remoteCode: string) => void;
  emitRemoteControlMsg: () => void;
}

const RemoteMemberClientContext = createContext<
  RemoteMemeberClient | undefined
>(undefined);

/**
 * 원격 제어에 참여하는 Member Client 입니다.
 * @returns RemoteMemeberClient {
 *   clientRef,
 *   remoteInfos,
 *   isConnected,
 *   eventEmitterRef,
 *   remoteControlMsg,
 *   publishMessage,
 *   pubRemoteConnect,
 *   setRemoteCode,
 *   emitRemoteControlMsg
 * }
 * @throws Provider 외부에서 사용 시 에러
 */
export const useRemoteMemberClient = () => {
  const context = useContext(RemoteMemberClientContext);
  if (!context) {
    throw new Error('useStompControlClient must be used within a Provider');
  }
  return context;
};

export const RemoteMemberClientProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const clientRef = useRef<Client>();
  const eventEmitterRef = useRef(new EventEmitter());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [subCount, setSubCount] = useState(0);
  const [remoteInfos, setRemoteInfos] = useState<RemoteConnectInfos>({
    remoteCode: '',
    subPath: '',
    pubPath: '',
    subId: '',
  });

  const [remoteConnectMsg, setRemoteConnectMsg] = useState<RemoteConnectMsg>();
  const [remoteControlMsg, setRemoteControlMsg] = useState<RemoteControlMsg>();

  const subInitChannels = () => {
    StompInitializer.subscribeTestHello(clientRef);
    subRemoteCodeConnectChannel();
  };

  const expireRemoteInfos = () => {
    setRemoteInfos({
      remoteCode: '',
      subPath: '',
      subId: '',
      pubPath: '',
    });
  };

  useEffect(() => {
    // TODO : remoteConnectMsg 가 에러인 경우 처리해야함
    // 예를 들어 이미 코드에 연결해둔 경우에는 remoteConnectMsg 가 error 메세지를 담고 있음
    // 따라서 이 경우 사용자에게 기존 연결을 끊고 새로 연결할 것인지 물어봐야함.
    // 그리고 예외 처리로, 이전 코드와 동일한데 새로운 subPath, pubPath 를 받은 경우에도 처리해야함
    // 이 처리는 여기서 하는 것보다 setRemoteCode 에서 하는 게 좋아보이는데
    // 자꾸 예외처리가 이리저리 이동해서 구조가 복잡하니까 나중에 리팩토링 해야할듯
    if (StompInitializer.isValideRemoteCode(remoteInfos.remoteCode)) {
      subRemoteAndUpdateRemoteInfos();
    } else {
      expireRemoteInfos();
    }
  }, [remoteConnectMsg]);

  useEffect(() => {
    console.log('remoteInfos : ', remoteInfos);
  }, [remoteInfos]);

  /**
   * 원격 연결 메세지가 수신된 경우, 해당 메세지를 바탕으로 subPath, pubPath 를 업데이트합니다.
   * subPath, pubPath 를 업데이트하면서, 이전 subId 를 unsubscribe 합니다.
   */
  const subRemoteAndUpdateRemoteInfos = () => {
    const prevCount = subCount;
    const prevSubId = `remoteMsg-${prevCount}`;
    const nextSubId = `remoteMsg-${prevCount + 1}`;

    clientRef.current.unsubscribe(prevSubId);
    clientRef.current.subscribe(
      remoteConnectMsg.subPath,
      (message: IMessage) => {
        try {
          const msg: RemoteControlMsg = JSON.parse(message.body);
          if (msg) {
            setRemoteControlMsg(msg);
          }
        } catch (e) {
          console.log('remoteControlMsg parse error : ', e);
        }
      },
      { id: nextSubId },
    );

    setRemoteInfos((prev) => {
      return {
        ...prev,
        subPath: remoteConnectMsg.subPath,
        pubPath: remoteConnectMsg.pubPath,
        subId: nextSubId,
      };
    });
    setSubCount((prev) => prev + 1);
  };

  /**
   * 원격 코드 연결 후 서버의 응답을 수신합니다.
   * onConnect 를 통해 기본적으로 등록합니다.
   * 서버의 응답이 정상적이라면, `remoteConnectMsg` 를 업데이트합니다.
   * 업데이트 된 `remoteConnectMsg` 는 useEffect 를 통해 subPath pubPath 를 변경합니다.
   */
  const subRemoteCodeConnectChannel = () => {
    clientRef.current.subscribe(
      '/user/topic/remote.connect',
      (message: IMessage) => {
        const remoteConnectMsg: RemoteConnectMsg =
          parseRemoteConnectMessage(message);

        setRemoteConnectMsg(remoteConnectMsg);
        console.log('remoteConnectMsg : ', remoteConnectMsg);
      },
      { id: 'remoteConnect' },
    );
  };

  const parseRemoteConnectMessage = (message: IMessage) => {
    const remoteMsg: RemoteConnectMsg = JSON.parse(message.body);
    if (remoteMsg.code !== 200) {
      throw new Error('remoteCodeIssueMessage error');
    }
    return remoteMsg;
  };

  const pubRemoteConnect = (remoteCode: string) => {
    if (!clientRef.current.connected) {
      console.log('client is not connected');
      return;
    }

    clientRef.current.publish({
      destination: '/app/remote.connect',
      body: JSON.stringify({ remoteCode: remoteCode }),
    });
  };

  const setRemoteCode = (paramRemoteCode: string) => {
    setRemoteInfos({
      ...remoteInfos,
      remoteCode: paramRemoteCode,
    });
  };

  /**
   * 현재 타이머의 상태들을 원격 제어 서버로 전송합니다.
   * @param pubStates 원격 제어로 보낼 타이머의 상태값을 담고 있는 JSON 객체
   */
  const publishMessage = (pubStates: RemoteControlMsg) => {
    clientRef.current.publish({
      destination: remoteInfos.pubPath,
      body: JSON.stringify(pubStates),
    });
  };

  const emitRemoteControlMsg = () => {
    eventEmitterRef.current.emit('remoteControlMsg');
  };

  const stompConfig: StompConfig = {
    brokerURL: websocketUrl,
    onConnect: () => {
      setIsConnected(true);
      expireRemoteInfos();
      subInitChannels();

      eventEmitterRef.current.emit('afterConnect');
    },
    onDisconnect: () => {
      expireRemoteInfos();
      setIsConnected(false);

      eventEmitterRef.current.emit('disconnect');
    },
    onWebSocketError: (error) => {
      setIsConnected(false);
      clientRef.current.deactivate();
      expireRemoteInfos();

      eventEmitterRef.current.emit('disconnect');
    },
    onStompError: (frame) => {
      setIsConnected(false);
      clientRef.current.deactivate();
      expireRemoteInfos();

      eventEmitterRef.current.emit('disconnect');
    },
    onWebSocketClose: () => {
      setIsConnected(false);
      clientRef.current.deactivate();
      expireRemoteInfos();

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
    <RemoteMemberClientContext.Provider
      value={{
        clientRef,
        remoteInfos,
        isConnected,
        eventEmitterRef,
        remoteControlMsg,
        publishMessage,
        pubRemoteConnect,
        setRemoteCode,
        emitRemoteControlMsg,
      }}
    >
      {children}
    </RemoteMemberClientContext.Provider>
  );
};
