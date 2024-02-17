import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import { Client, StompConfig, IMessage } from '@stomp/stompjs';
import StompInitializer from './StompInitializer';
import {
  CodeIssueResponse,
  RemoteCodeIssueMsg,
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
  remoteControlMsg: RemoteControlMsg;
  publishMessage: (pubStates: RemoteControlMsg) => void;
  pubIssueCode: () => void;
  emitRemoteControlMsg: () => void;
}

const RemoteHostClientContext = createContext<RemoteHostClient | undefined>(
  undefined,
);

/**
 * 원격 제어 코드를 발급하는 Host Client 입니다.
 * @returns RemoteHostClient
 * {
 * clientRef,
 * remoteInfos,
 * isConnected,
 * eventEmitterRef,
 * remoteControlMsg,
 * publishMessage,
 * pubIssueCode
 * }
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
  const eventEmitterRef = useRef(new EventEmitter());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [subCount, setSubCount] = useState(0);
  const [remoteInfos, setRemoteInfos] = useState<RemoteConnectInfos>({
    remoteCode: '',
    subPath: '',
    subId: '',
    pubPath: '',
  });

  const [remoteIssueMsg, setRemoteIssueMsg] = useState<RemoteCodeIssueMsg>();
  const [remoteControlMsg, setRemoteControlMsg] = useState<RemoteControlMsg>();

  const subInitChannels = () => {
    StompInitializer.subscribeTestHello(clientRef);
    subRemoteCodeReceiveChannel();
  };

  const expireRemoteInfos = () => {
    setRemoteInfos({
      remoteCode: '',
      subPath: '',
      subId: '',
      pubPath: '',
    });
  };

  /**
   * 코드 발급 메세지가 업데이트 되면,
   * 메세지에 담긴 원격 제어 채널을 구독합니다.
   */
  useEffect(() => {
    console.log('useEffect :: remoteInfos ', remoteIssueMsg);
    if (
      remoteIssueMsg &&
      StompInitializer.isValideRemoteCode(remoteIssueMsg.remoteCode)
    ) {
      subRemoteAndUpdateRemoteInfos();
    } else {
      expireRemoteInfos();
    }
  }, [remoteIssueMsg]);

  /**
   * 원격 코드를 발급한 이후 subPath 를 subscribe 하여 원격 명령을 받습니다.
   */
  const subRemoteAndUpdateRemoteInfos = () => {
    const prevCount = subCount;
    const prevSubId = `remoteMsg-${prevCount}`;
    const nextSubId = `remoteMsg-${prevCount + 1}`;

    clientRef.current.unsubscribe(prevSubId);
    clientRef.current.subscribe(
      remoteIssueMsg.subPath,
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
        remoteCode: remoteIssueMsg.remoteCode,
        subPath: remoteIssueMsg.subPath,
        pubPath: remoteIssueMsg.pubPath,
        subId: nextSubId,
      };
    });
    setSubCount((prev) => prev + 1);
  };

  // TODO : unsubscribe 안해도 중복 sub 문제 발생 안하려나?
  const subRemoteCodeReceiveChannel = () => {
    clientRef.current.subscribe(
      '/user/topic/remote.receivecode',
      (message: IMessage) => {
        const remoteIssueMsg: RemoteCodeIssueMsg =
          parseCodeIssueMessage(message);
        console.log('remote code : ', remoteIssueMsg);

        setRemoteIssueMsg(remoteIssueMsg);
        console.log('remoteConnectMsg : ', remoteIssueMsg);
      },
      { id: 'remoteReceiveCode' },
    );
  };

  const parseCodeIssueMessage: (message: IMessage) => CodeIssueResponse = (
    message,
  ) => {
    const remoteMsg: CodeIssueResponse = JSON.parse(message.body);
    if (remoteMsg.code !== 200) {
      throw new Error(`remoteCodeIssueMessage error ${remoteMsg}`);
    }
    return remoteMsg;
  };

  /**
   * 코드 발급을 위한 요청을 서버로 전송합니다.
   */
  const pubIssueCode = () => {
    clientRef.current.publish({
      destination: '/app/remote.issuecode',
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

      eventEmitterRef.current.emit('connect');
    },
    onDisconnect: () => {
      setIsConnected(false);
      expireRemoteInfos();

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
    <RemoteHostClientContext.Provider
      value={{
        clientRef,
        remoteInfos,
        isConnected,
        eventEmitterRef,
        remoteControlMsg,
        publishMessage,
        pubIssueCode,
        emitRemoteControlMsg,
      }}
    >
      {children}
    </RemoteHostClientContext.Provider>
  );
};
