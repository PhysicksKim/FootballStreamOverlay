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
  RemoteControlMsg,
  StompClientRef,
  RemoteInfos,
  RemoteConnectMsg,
} from '@src/types/stompTypes';
import EventEmitter from 'events';
import RemoteUtil from './StompInitializer';

// API 서버 환경변수 (개발/서비스 환경)
const apiUrl = process.env.API_URL;
const websocketUrl = process.env.WEBSOCKET_URL + '/ws';

export interface HostClient {
  connectAsHost: () => void;
}

export interface MemberClient {
  connectAsMember: (remoteCode: string) => void;
}

// Provider 의 value 로 사용될 타입
export interface RemoteClient {
  clientRef: StompClientRef;
  remoteInfos: RemoteInfos;
  remoteCode: string;
  isConnected: boolean;
  eventEmitterRef: React.MutableRefObject<EventEmitter>;
  remoteConrolMsg: RemoteControlMsg | undefined;
  publishMessage: (pubStates: RemoteControlMsg) => void;
  emitRemoteControlMsg: () => void;
  hostClient: HostClient;
  memberClient: MemberClient;
}

const RemoteClientContext = createContext<RemoteClient | undefined>(undefined);

/**
 * 원격 제어에 참여하는 Member Client 입니다.
 * @returns RemoteMemeberClient {
 *   clientRef,
 *   remoteInfos,
 *   remoteCode,
 *   isConnected,
 *   eventEmitterRef,
 *   remoteConrolMsg,
 *   publishMessage,
 *   emitRemoteControlMsg,
 *   hostClient,
 *   memberClient,
 * }
 * @throws Provider 외부에서 사용 시 에러
 */
export const useRemoteClient = () => {
  const context = useContext(RemoteClientContext);
  if (!context) {
    throw new Error('useRemoteClient must be used within a Provider');
  }
  return context;
};

export const RemoteClientProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const clientRef = useRef<Client>();
  const eventEmitterRef = useRef(new EventEmitter());
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 원격에 사용되는 각종 상태값들 (원격 코드, 원격 연결 path)
  const [remoteCode, setRemoteCode] = useState<string>('');
  const [remoteInfos, setRemoteInfos] = useState<RemoteInfos>({
    subPath: '',
    pubPath: '',
    subId: '',
  });

  // 원격 연결시 사용 (원격 코드 발급 or 코드 등록)
  const [subCount, setSubCount] = useState(0);
  const [remoteConnectMsg, setRemoteConnectMsg] = useState<RemoteConnectMsg>();
  const remoteInfosRef = useRef(remoteInfos);

  // 원격 제어 메세지
  const [remoteConrolMsg, setRemoteControlMsg] = useState<RemoteControlMsg>();

  const subInitChannels = () => {
    subRemoteCodeConnectChannel();
    subRemoteCodeReceiveChannel();
  };

  const expireRemoteInfos = () => {
    setRemoteInfos({
      subPath: '',
      subId: '',
      pubPath: '',
    });
  };

  useEffect(() => {
    console.log('remoteInfos updated :: ', remoteInfos);
    remoteInfosRef.current = remoteInfos;
  }, [remoteInfos]);

  /**
   * 사용자가 원격 코드를 발급 또는 등록 후, 원격 채널을 등록합니다.
   */
  useEffect(() => {
    console.log('useEffect _ remoteConnectMsg : ', remoteConnectMsg);
    if (
      remoteConnectMsg &&
      RemoteUtil.isValideRemoteCode(remoteConnectMsg.remoteCode)
    ) {
      // TODO : remoteConnectMsg 가 에러인 경우 처리해야함
      // 예를 들어 이미 코드에 연결해둔 경우에는 remoteConnectMsg 가 error 메세지를 담고 있음
      // 따라서 이 경우 사용자에게 기존 연결을 끊고 새로 연결할 것인지 물어봐야함.
      // 그리고 예외 처리로, 이전 코드와 동일한데 새로운 subPath, pubPath 를 받은 경우에도 처리해야함
      // 이 처리는 여기서 하는 것보다 setRemoteCode 에서 하는 게 좋아보이는데
      // 자꾸 예외처리가 이리저리 이동해서 구조가 복잡하니까 나중에 리팩토링 해야할듯
      subRemoteAndUpdateRemoteInfos();
    }
  }, [remoteConnectMsg]);

  useEffect(() => {
    console.log('remoteConrolMsg updated :: ', remoteConrolMsg);
  }, [remoteConrolMsg]);

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

    console.log('remoteConnectMsg : ', remoteConnectMsg);
    setRemoteCode(remoteConnectMsg.remoteCode);
    setRemoteInfos((_) => {
      return {
        subPath: remoteConnectMsg.subPath,
        pubPath: remoteConnectMsg.pubPath,
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
        const remoteIssueMsg: RemoteConnectMsg = parseRemoteEnrollMsg(message);

        setRemoteConnectMsg(remoteIssueMsg);
        console.log('remoteIssue : ', remoteIssueMsg);
      },
      { id: 'remoteReceiveCode' },
    );
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
          parseRemoteEnrollMsg(message);

        setRemoteConnectMsg(remoteConnectMsg);
        console.log('remoteConnectMsg : ', remoteConnectMsg);
      },
      { id: 'remoteConnect' },
    );
  };

  /**
   * 원격 코드 발급(Host), 원격 코드 연결(Member) 의 응답 메세지를 파싱합니다.
   * @param message
   * @returns
   */
  const parseRemoteEnrollMsg: (message: IMessage) => RemoteConnectMsg = (
    message,
  ) => {
    const remoteMsg: RemoteConnectMsg = JSON.parse(message.body);
    if (remoteMsg.code !== 200) {
      throw new Error(`remoteCodeIssueMessage error ${remoteMsg}`);
    }
    return remoteMsg;
  };

  /**
   * 코드 발급을 위한 요청을 서버로 전송합니다.
   */
  const connectAsHost = () => {
    clientRef.current.publish({
      destination: '/app/remote.issuecode',
    });
  };

  /**
   * Member 로서 원격 제어 서버에 연결합니다.
   * RemoteCode 를 바탕으로 Host 에 연결을 요청합니다.
   * @param remoteCode
   * @returns void
   */
  const connectAsMember: (remoteCode: string) => void = (
    remoteCode: string,
  ) => {
    if (!clientRef.current.connected) {
      console.log('client is not connected');
      return;
    }
    if (!RemoteUtil.isValideRemoteCode(remoteCode)) {
      console.log(`remoteCode is not valid :: [${remoteCode}]`);
    }

    setRemoteCode(remoteCode);
    clientRef.current.publish({
      destination: '/app/remote.connect',
      body: JSON.stringify({ remoteCode: remoteCode }),
    });
  };

  /**
   * 현재 타이머의 상태들을 원격 제어 서버로 전송합니다.
   * @param pubStates 원격 제어로 보낼 타이머의 상태값을 담고 있는 JSON 객체
   */
  const publishMessage = (pubStates: RemoteControlMsg) => {
    clientRef.current.publish({
      destination: remoteInfosRef.current.pubPath,
      body: JSON.stringify(pubStates),
    });
  };

  const emitRemoteControlMsg = () => {
    eventEmitterRef.current.emit('publishRemoteControlMsg');
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
    <RemoteClientContext.Provider
      value={{
        clientRef,
        remoteInfos,
        remoteCode,
        isConnected,
        eventEmitterRef,
        remoteConrolMsg,
        publishMessage,
        emitRemoteControlMsg,
        hostClient: {
          connectAsHost,
        },
        memberClient: {
          connectAsMember,
        },
      }}
    >
      {children}
    </RemoteClientContext.Provider>
  );
};
