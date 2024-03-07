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
import axios from 'axios';
import { Urls } from '@src/classes/Utils';

export interface HostClient {
  connectAsHost: (nickname: string, isAutoRemote: boolean) => void;
}

export interface MemberClient {
  connectAsMember: (
    remoteCode: string,
    nickname: string,
    isAutoRemote: boolean,
  ) => void;
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

  // TODO : 닉네임 설정 저장 변경 유효성 및 중복검사 기능 / 원격 코드 연결&발급 시 닉네임state 포함하도록 변경 / 채널 닉네임 관리 기능
  const [ninkname, setNickname] = useState<string>('tester');
  const [channelNicknames, setChannelNicknames] = useState<string[]>([]);

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
    subRemoteCommonChannel();
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
    switch (remoteConnectMsg?.type) {
      case 'issue':
      case 'connect':
        if (
          remoteConnectMsg &&
          RemoteUtil.isValideRemoteCode(remoteConnectMsg.remoteCode)
        ) {
          subRemoteAndUpdateRemoteInfos();
        }
        if (remoteConnectMsg.autoRemote) {
          getUserCookie(remoteConnectMsg.cookieGetUrl);
        }
        break;
      case 'error':
      default:
        console.log('remoteConnectMsg error :: ', remoteConnectMsg);
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

    updateRemoteInfosWithUnsub(prevCount, prevSubId, nextSubId);

    setRemoteCode(remoteConnectMsg.remoteCode);
    setRemoteInfos((_) => {
      return {
        subPath: remoteConnectMsg.subPath,
        pubPath: remoteConnectMsg.pubPath,
        subId: nextSubId,
      };
    });
  };

  const updateRemoteInfosWithUnsub = (
    prevCount: number,
    prevSubId: string,
    nextSubId: string,
  ) => {
    if (prevCount > 0) {
      clientRef.current.unsubscribe(prevSubId);
    }
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
    setSubCount((prev) => prev + 1);
  };

  /**
   * 원격 코드 연결과 관련된 서버의 응답을 수신합니다.
   * onConnect 핸들러를 통해 등록합니다.
   * 서버의 응답 메세지가 정상적이라면(에러메세지 포함), `remoteConnectMsg` 를 업데이트합니다.
   * 업데이트 된 `remoteConnectMsg` 는 useEffect 를 통해 subPath pubPath 를 변경하거나 에러를 처리합니다.
   */
  const subRemoteCommonChannel = () => {
    clientRef.current.subscribe(
      '/user/topic/remote',
      (message: IMessage) => {
        const remoteCommonMsg: RemoteConnectMsg = parseRemoteCommonMsg(message);
        setRemoteConnectMsg(remoteCommonMsg);
      },
      { id: 'remoteCommonMsg' },
    );
  };

  /**
   * 원격 코드 발급(issue code), 원격 코드 연결(connect) 의 응답 메세지를 파싱합니다.
   * @param message
   * @returns
   */
  const parseRemoteCommonMsg: (message: IMessage) => RemoteConnectMsg = (
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
  const connectAsHost = (nickname: string, isAutoRemote: boolean) => {
    nickname = nickname.trim();

    if (isNotValidNickname(nickname)) {
      console.log(`nickname is not valid :: [${nickname}]`);
      return;
    }

    clientRef.current.publish({
      destination: '/app/remote.issuecode',
      body: JSON.stringify({ nickname: nickname, autoRemote: isAutoRemote }),
    });
  };

  /**
   * Member 로서 원격 제어 서버에 연결합니다.
   * RemoteCode 를 바탕으로 Host 에 연결을 요청합니다.
   * @param remoteCode
   * @returns void
   */
  const connectAsMember: (
    remoteCode: string,
    nickname: string,
    isAutoRemote: boolean,
  ) => void = (remoteCode: string, nickname: string, isAutoRemote: boolean) => {
    if (!clientRef.current.connected) {
      console.log('client is not connected');
      return;
    }
    if (!RemoteUtil.isValideRemoteCode(remoteCode)) {
      console.log(`remoteCode is not valid :: [${remoteCode}]`);
    }
    nickname = nickname.trim();
    if (isNotValidNickname(nickname)) {
      console.log(`nickname is not valid :: [${nickname}]`);
      return;
    }

    setRemoteCode(remoteCode);
    clientRef.current.publish({
      destination: '/app/remote.connect',
      body: JSON.stringify({
        remoteCode: remoteCode,
        nickname: nickname,
        autoRemote: isAutoRemote,
      }),
    });
  };

  const isNotValidNickname = (nickname: string) => {
    return new Blob([nickname]).size > 30;
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
  const getUserCookie = (cookieGetUrl: string) => {
    axios
      .get(Urls.apiUrl + cookieGetUrl, { withCredentials: true })
      .then((res) => {
        console.log('getUserCookie res : ', res);
      })
      .catch((err) => {
        console.log('getUserCookie err : ', err);
      });
  };

  const stompConfig: StompConfig = {
    brokerURL: Urls.websocketUrl,
    onConnect: () => {
      setIsConnected(true);
      expireRemoteInfos();
      subInitChannels();

      eventEmitterRef.current.emit('afterConnect');
    },
    onDisconnect: () => {
      console.log('onDisconnect');
      expireRemoteInfos();
      setIsConnected(false);

      eventEmitterRef.current.emit('disconnect');
    },
    onWebSocketError: (error) => {
      console.log('onWebSocketError', error);
      setIsConnected(false);
      expireRemoteInfos();

      clientRef.current.deactivate();
      eventEmitterRef.current.emit('disconnect');
    },
    onStompError: (frame) => {
      console.log('onStompError', frame);
      setIsConnected(false);
      expireRemoteInfos();

      clientRef.current.deactivate();
      eventEmitterRef.current.emit('disconnect');
    },
    onWebSocketClose: () => {
      console.log('onWebSocketClose');
      setIsConnected(false);
      expireRemoteInfos();

      clientRef.current.deactivate();
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
