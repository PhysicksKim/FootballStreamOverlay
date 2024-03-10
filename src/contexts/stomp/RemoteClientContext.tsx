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
  RemoteChannelMsg,
  StompClientRef,
  RemoteInfos,
  RemoteCommonMessage,
} from '@src/types/stompTypes';
import EventEmitter from 'events';
import RemoteUtil from './StompInitializer';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
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

export type RemoteConnectType = 'issue' | 'connect' | 'autoremote';

// Provider 의 value 로 사용될 타입
export interface RemoteClient {
  clientRef: StompClientRef;
  remoteInfos: RemoteInfos;
  remoteCode: string;
  isConnected: boolean;
  eventEmitterRef: React.MutableRefObject<EventEmitter>;
  remoteConrolMsg: RemoteChannelMsg | undefined;
  publishMessage: (pubStates: RemoteChannelMsg) => void;
  emitRemoteControlMsg: () => void;
  hostClient: HostClient;
  memberClient: MemberClient;
  doAutoReconnect: (nickname: string) => void;
  autoRemote: {
    nickname: string;
    isAutoRemote: boolean;
    updateNickname: (nickname: string) => void;
    updateIsAutoRemote: (isAutoRemote: boolean) => void;
  };
  error: {
    message: string;
    updateMessage: (message: string) => void;
  };
  memberNicknames: string[];
  clearAll: () => Promise<AxiosResponse<any, any>>;
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
  const remoteInfosRef = useRef(remoteInfos);

  // 원격 연결시 사용 (원격 코드 발급 or 코드 등록)
  const [subCount, setSubCount] = useState(0);
  const [remoteConnectMsg, setRemoteConnectMsg] =
    useState<RemoteCommonMessage>();

  // 원격 제어 채널 메세지
  const [remoteChannelMsg, setRemoteChannelMsg] = useState<RemoteChannelMsg>();

  // 원격 연결 방식
  const [remoteConnectType, setRemoteConnectType] =
    useState<RemoteConnectType>('issue');
  const [nickname, setNickname] = useState<string>(
    () => localStorage.getItem('nickname') || 'defaultNickname',
  );
  const [isAutoRemote, setIsAutoRemote] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('isAutoRemote') || 'false'),
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 채널 멤버 이름 channelMembers
  const [memberNicknames, setMemberNicknames] = useState<string[]>([]);

  useEffect(() => {
    if (!clientRef.current) {
      try {
        clientRef.current = new Client(stompConfig);
      } catch (e) {
        console.log('stomp client initialize error ', e);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Urls.apiUrl', Urls.apiUrl);
    console.log('Urls.websocketUrl', Urls.websocketUrl);
  }, []);

  // 새로운 원격 정보를 받으면
  // 원격 제어 정보 업데이트
  // 새로 원격 채널에 입장했으므로, 채널 닉네임들을 요청합니다.
  useEffect(() => {
    remoteInfosRef.current = remoteInfos;
    requestMemberNicknames();
  }, [remoteInfos]);

  useEffect(() => {
    if (
      remoteChannelMsg?.type === 'members' &&
      'members' in remoteChannelMsg.data
    ) {
      setMemberNicknames(remoteChannelMsg.data.members);
    }
  }, [remoteChannelMsg]);

  /**
   * 사용자가 원격 코드를 발급 또는 등록 후, 원격 채널을 등록합니다.
   */
  useEffect(() => {
    console.log('useEffect _ remoteConnectMsg : ', remoteConnectMsg);
    switch (remoteConnectMsg?.type) {
      case 'autoreconnect':
      case 'issue':
      case 'connect':
        console.log('remoteConnectMsg type : ', remoteConnectMsg.type);
        if (
          remoteConnectMsg &&
          RemoteUtil.isValideRemoteCode(remoteConnectMsg.remoteCode)
        ) {
          subRemoteAndUpdateRemoteInfos();
        }
        if (remoteConnectMsg.autoRemote) {
          // getUserCookie
          axios
            .get(Urls.apiUrl + remoteConnectMsg.cookieGetUrl, {
              withCredentials: true,
            })
            .then((res) => {
              console.log('getUserCookie res : ', res);
            })
            .catch((err) => {
              console.log('getUserCookie err : ', err);
            });
        }

        break;
      case 'sub':
        eventEmitterRef.current.emit('afterSub');
        break;
      case 'error':
        // 원격 연결 에러 시 자동 재연결 해제를 위한 localStorage autoRemote false 설정
        saveToLocalStorage(nickname, false);
        setErrorMsg(remoteConnectMsg.message);
        break;
      default:
        console.log('remoteConnectMsg others :: ', remoteConnectMsg);
    }
  }, [remoteConnectMsg]);

  /**
   * 원격 코드 연결과 관련된 서버의 응답을 수신합니다.
   * 단순히 sub 후 parsing 하여 state 변수 업데이트에 집중하고,
   * 세부 사항별 분기 로직은 useEffect(,[remoteConnectMsg]) 에서 처리합니다.
   */
  const subRemoteCommonChannel = () => {
    console.log('subRemoteCommonChannel');
    clientRef.current.subscribe(
      '/user/topic/remote',
      (message: IMessage) => {
        const _remoteCommonMsg: RemoteCommonMessage =
          parseRemoteCommonMsg(message);
        setRemoteConnectMsg(_remoteCommonMsg);
      },
      { id: 'remoteCommonMsg' },
    );
  };

  const doAutoReconnect = (nickname: string) => {
    console.log('doAutoReconnect');
    if (isNotValidNickname(nickname)) {
      console.log(`nickname is not valid :: [${nickname}]`);
      return;
    }

    // 쿠키 캐싱
    saveToLocalStorage(nickname, isAutoRemote);
    axios
      .post(
        Urls.apiUrl + '/api/scoreboard/user/cookie',
        {},
        { withCredentials: true },
      )
      .catch((err) => {
        console.log('auto reconnect 용 cookie 가 존재하지 않습니다');
      })
      .then((res) => {
        // sub 완료 후 할 작업
        eventEmitterRef.current.on('afterSub', () => {
          clientRef.current.publish({
            destination: '/app/remote.autoreconnect',
            body: JSON.stringify({ nickname: nickname }),
          });
        });

        // activate
        clientRef.current.activate();
        // subscribe 에서 setRemoteConnectMsg 하고,
        // useEffect 에서 remoteConnectMsg 에서 type=autoreconnect 처리함
        // autoreconnect 는 issue 나 connect 와 응답이 동일함
      });
  };

  const expireRemoteInfos = () => {
    setRemoteInfos({
      subPath: '',
      subId: '',
      pubPath: '',
    });
  };

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
          const msg: RemoteChannelMsg = JSON.parse(message.body);
          if (msg) {
            setRemoteChannelMsg(msg);
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
   * 원격 코드 발급(issue code), 원격 코드 연결(connect) 의 응답 메세지를 파싱합니다.
   * @param message
   * @returns
   */
  const parseRemoteCommonMsg: (message: IMessage) => RemoteCommonMessage = (
    message,
  ) => {
    const remoteMsg: RemoteCommonMessage = JSON.parse(message.body);
    return remoteMsg;
  };

  /**
   * 코드 발급을 위한 요청을 서버로 전송합니다.
   */
  const connectAsHost = (nickname: string, isAutoRemote: boolean) => {
    nickname = nickname.trim();
    if (isNotValidNickname(nickname)) {
      console.log(`nickname is not valid :: [${nickname}]`);
      setErrorMsg('nickname:유효하지 않은 닉네임 입니다. 최대 30자');
      return;
    }

    saveToLocalStorage(nickname, isAutoRemote);
    eventEmitterRef.current.removeAllListeners('afterSub');
    eventEmitterRef.current.on('afterSub', () => {
      clientRef.current.publish({
        destination: '/app/remote.issuecode',
        body: JSON.stringify({ nickname: nickname, autoRemote: isAutoRemote }),
      });
    });

    // TODO : afterSub 이벤트를 발생시키기 위해 deactivate 후에 activate 하는게 맞는지 확인 필요
    // 오버헤드 생김 개선필요
    if (clientRef.current.active) {
      clientRef.current.deactivate().then(() => {
        clientRef.current.activate();
      });
    } else {
      clientRef.current.activate();
    }
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
    if (!RemoteUtil.isValideRemoteCode(remoteCode)) {
      setErrorMsg('code:유효하지 않은 원격 코드입니다.');
      console.log(`remoteCode is not valid :: [${remoteCode}]`);
      return;
    }
    nickname = nickname.trim();
    if (isNotValidNickname(nickname)) {
      setErrorMsg('nickname:유효하지 않은 닉네임 입니다. 최대 30자');
      console.log(`nickname is not valid :: [${nickname}]`);
      return;
    }

    saveToLocalStorage(nickname, isAutoRemote);
    eventEmitterRef.current.removeAllListeners('afterSub');
    eventEmitterRef.current.on('afterSub', () => {
      clientRef.current.publish({
        destination: '/app/remote.connect',
        body: JSON.stringify({
          remoteCode: remoteCode,
          nickname: nickname,
          autoRemote: isAutoRemote,
        }),
      });
    });

    // TODO : connectAsMember 에서 activate 하는게 맞는지 확인 필요
    // onConnect 에서 sub 명령이 전달되고, sub 명령이 전달되어야지 afterSub 로 connect 가 발생함
    // 그래서 active 상태인 경우 onConnect 를 발생시키기 위해서 disConnect 후에 connect 를 발생시킴
    // 이걸 나중에 개선해야 할 것 같음.
    // 코드 입력 실패했다고 websocket close 후 재연결 하는건 좀 오버헤드가 생기니까
    // onConnect 에서 subEvent 발생시키는 거 감지하는 방식 말고, 다른 방식이 어떨지 싶음
    if (clientRef.current.active) {
      clientRef.current.deactivate().then(() => {
        clientRef.current.activate();
      });
    } else {
      clientRef.current.activate();
    }
  };

  const isNotValidNickname = (nickname: string) => {
    const _result = (() => {
      if (!nickname) return true;
      if (typeof nickname !== 'string') return true;
      return new Blob([nickname]).size > 30;
    })();

    return _result;
  };

  /**
   * 현재 타이머의 상태들을 원격 제어 서버로 전송합니다.
   * @param pubStates 원격 제어로 보낼 타이머의 상태값을 담고 있는 JSON 객체
   */
  const publishMessage = (pubStates: RemoteChannelMsg) => {
    clientRef.current.publish({
      destination: remoteInfosRef.current.pubPath,
      body: JSON.stringify(pubStates),
    });
  };

  const requestMemberNicknames = () => {
    if (clientRef.current.connected) {
      clientRef.current.publish({
        destination: remoteInfos.pubPath + '/members',
        body: JSON.stringify({}),
      });
    }
  };

  const emitRemoteControlMsg = () => {
    eventEmitterRef.current.emit('publishRemoteControlMsg');
  };

  const stompConfig: StompConfig = {
    brokerURL: Urls.websocketUrl,
    onConnect: () => {
      setIsConnected(true);
      expireRemoteInfos();
      subRemoteCommonChannel();

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

  const saveToLocalStorage = (nickname: string, isAutoRemote: boolean) => {
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('isAutoRemote', JSON.stringify(isAutoRemote));
  };

  const updateNickname = (newNickname: string) => {
    setNickname(newNickname);
    saveToLocalStorage(newNickname, isAutoRemote); // 로컬 스토리지 업데이트
  };

  const updateIsAutoRemote = (newIsAutoRemote: boolean) => {
    setIsAutoRemote(newIsAutoRemote);
    saveToLocalStorage(nickname, newIsAutoRemote); // 로컬 스토리지 업데이트
  };

  const clearAll = async () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
    eventEmitterRef.current.removeAllListeners();
    setRemoteCode('');
    setRemoteInfos({
      subPath: '',
      subId: '',
      pubPath: '',
    });
    setRemoteConnectMsg(undefined);
    setRemoteChannelMsg(undefined);
    setRemoteConnectType('issue');
    setNickname('defaultNickname');
    setIsAutoRemote(false);
    setErrorMsg('');
    localStorage.removeItem('nickname');
    localStorage.removeItem('isAutoRemote');
    setMemberNicknames([]);

    return axios.post(
      Urls.apiUrl + '/api/scoreboard/user/cookie/clear',
      {},
      {
        withCredentials: true,
      },
    );
  };

  return (
    <RemoteClientContext.Provider
      value={{
        clientRef,
        remoteInfos,
        remoteCode,
        isConnected,
        eventEmitterRef,
        remoteConrolMsg: remoteChannelMsg,
        publishMessage,
        emitRemoteControlMsg,
        hostClient: {
          connectAsHost,
        },
        memberClient: {
          connectAsMember,
        },
        doAutoReconnect,
        autoRemote: {
          nickname,
          isAutoRemote,
          updateNickname,
          updateIsAutoRemote,
        },
        error: {
          message: errorMsg,
          updateMessage: (message: string) => {
            setErrorMsg(message);
          },
        },
        clearAll,
        memberNicknames,
      }}
    >
      {children}
    </RemoteClientContext.Provider>
  );
};
