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
  ControlChannelMsg,
} from '@src/types/stompTypes';
import EventEmitter from 'events';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { Urls } from '@src/classes/Utils';
import RemoteUtil from './StompInitializer';
import { cli } from 'webpack';

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
  initStompClient: () => void;
  clearAll: () => Promise<AxiosResponse<any>>;
  setOnReceiveControlMessage: (cb: (data: ControlChannelMsg) => void) => void;
  setRemotePubData: (data: RemoteChannelMsg) => void;
  publishMessage: () => void;
  connectAsHost: (nickname: string, isAutoRemote: boolean) => void;
  connectAsMember: (
    nickname: string,
    remoteCode: string,
    isAutoRemote: boolean,
  ) => void;
  isNotValidNickname: (nickname: string) => boolean;
  updateNickname: (newNickname: string) => void;
  updateIsAutoRemote: (newIsAutoRemote: boolean) => void;
  getStoredInfos: () => { nickname: string; isAutoRemote: boolean };
  memberNicknames: string[];
  remoteCode: string;
  remoteInfos: RemoteInfos;
  isBasicSubDone: boolean;
  isRemoteConnected: boolean;
  errorMsg: string;
  cleanErrorMsg: (ms: number) => void;
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

  const subscriptionRef = useRef(null);
  const onReceiveControlMsgCbRef = useRef<(data: ControlChannelMsg) => void>();
  const remotePubDataRef = useRef<RemoteChannelMsg>();
  const subPollingIntervalRef = useRef<any>();

  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const cleaningIntervalRef = useRef<any>();

  const [isBasicSubDone, setIsBasicSubDone] = useState<boolean>(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState<boolean>(false);

  const [remoteCode, setRemoteCode] = useState<string>('');
  const [remoteInfos, setRemoteInfos] = useState<RemoteInfos>({
    subPath: '',
    subId: '',
    pubPath: '',
  });
  const remoteInfosRef = useRef<RemoteInfos>(remoteInfos);

  const [errorMsg, setErrorMsg] = useState<string>('');

  // 채널 멤버 이름 channelMembers
  const [memberNicknames, setMemberNicknames] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>(
    () => localStorage.getItem('nickname') || '기본닉네임',
  );

  // 원격 자동 연결
  const [initalIsAutoRemote, _] = useState<boolean>(
    JSON.parse(localStorage.getItem('isAutoRemote') || 'false'),
  );
  const [isAutoRemote, setIsAutoRemote] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('isAutoRemote') || 'false'),
  );

  // ------------------
  const initStompClient = () => {
    if (!clientRef.current) {
      clientRef.current = new Client(stompConfig);
      clientRef.current.activate();
    } else if (!clientRef.current?.active) {
      clientRef.current.activate();
    }
  };

  const stompConfig: StompConfig = {
    brokerURL: Urls.websocketUrl,
    onConnect: () => {
      // Subscribe : /user/topic/remote
      subscribeRemoteCommonChannel();
    },
    onDisconnect: () => {
      setIsBasicSubDone(false);
      setIsRemoteConnected(false);
      clearSubCheckPolling();
    },
  };

  // 기본 응답 수신에 사용되는 /user/topic/remote 채널을 구독합니다.
  const subscribeRemoteCommonChannel = () => {
    clientRef.current.subscribe(
      '/user/topic/remote',
      (message: IMessage) => {
        updateBasicRemoteChannelMessage(message);
      },
      { id: 'remoteCommonMsg' },
    );
    pollingSubscribeDoneMessage();
  };

  /**
   * clientSide 에서 원격 제어 채널 구독이 완료되었는지 확인하기 위해서 0.3초 마다 요청을 보냅니다.
   * 구독에 성공했다면 서버에서 msg.type === sub 응답을 보내줍니다.
   * 이 응답을 받으면 polling interval 을 중지해야 합니다.
   */
  const pollingSubscribeDoneMessage = () => {
    if (subPollingIntervalRef.current) {
      clearInterval(subPollingIntervalRef.current);
      subPollingIntervalRef.current = null;
    }

    setTimeout(() => {
      subPollingIntervalRef.current = setInterval(() => {
        clientRef.current.publish({
          destination: '/app/remote.subcheck',
          body: JSON.stringify({}),
        });
      }, 300);
    }, 100);
  };

  const clearSubCheckPolling = () => {
    clearInterval(subPollingIntervalRef.current);
    subPollingIntervalRef.current = null;
  };

  /**
   * /user/topic/remote 채널의 메세지를 처리합니다.
   * @param rawMessage
   * @returns
   */
  const updateBasicRemoteChannelMessage: (
    rawMessage: IMessage,
  ) => RemoteCommonMessage = (rawMessage) => {
    let remoteMsg: RemoteCommonMessage;
    try {
      remoteMsg = JSON.parse(rawMessage.body);
    } catch (e) {
      return;
    }

    switch (remoteMsg.type) {
      case 'sub':
        clearSubCheckPolling();
        setIsBasicSubDone(true);
        handleInitAutoRemote(nickname, isAutoRemote);
        break;
      case 'issue':
      case 'connect':
      case 'autoreconnect':
        handleNewRemoteChannelMsg(remoteMsg);
        break;
      case 'error':
        setErrorMsg(remoteMsg.message);
        break;
      default:
        break;
    }

    // setRemoteConnectMsg(remoteMsg);
    return remoteMsg;
  };

  /**
   * 새롭게 발급받은 remote channel 을 구독합니다. 이전 채널 구독을 해제합니다.
   * @param remoteMsg
   */
  const handleNewRemoteChannelMsg = (remoteMsg: RemoteCommonMessage) => {
    unsubPrevRemoteChannel();
    subRemoteControlChannel(remoteMsg);
    updateRemoteInfos(remoteMsg);
    setIsRemoteConnected(true);

    if (remoteMsg.autoRemote) {
      const cookieGetUrl = remoteMsg.cookieGetUrl;
      getAutoRemoteCookie(cookieGetUrl);
    }
  };

  /**
   * 자동 재연결을 위한 쿠키를 요청합니다.
   */
  const getAutoRemoteCookie = (cookieGetUrl: string) => {
    axios
      .get(Urls.apiUrl + cookieGetUrl, { withCredentials: true })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * 이전에 구독 중이던 /user/topic/remote/{remotecode} 채널을 구독 해제합니다.
   * @returns
   */
  const unsubPrevRemoteChannel = () => {
    if (!subscriptionRef.current) {
      return;
    }
    clientRef.current.unsubscribe(subscriptionRef.current);
    subscriptionRef.current = null;
  };

  /**
   * /user/topci/remote/{remotecode} 채널을 구독합니다.
   * @param remoteMsg
   */
  const subRemoteControlChannel = (remoteMsg: RemoteCommonMessage) => {
    // 새 채널 구독 아이디 설정
    subscriptionRef.current = `remote-${remoteMsg.code}`;
    clientRef.current.subscribe(
      remoteMsg.subPath,
      (message: IMessage) => {
        callbackRemoteChannelMessage(message);
      },
      { id: subscriptionRef.current },
    );
  };

  const updateRemoteInfos = (remoteMsg: RemoteCommonMessage) => {
    const remoteCode = remoteMsg.remoteCode;
    const remoteInfos: RemoteInfos = {
      subPath: remoteMsg.subPath,
      subId: subscriptionRef.current,
      pubPath: remoteMsg.pubPath,
    };
    setRemoteCode(remoteCode);
    setRemoteInfos(remoteInfos);
  };

  /**
   * /user/topic/remote/{remotecode} 채널의 메세지를 처리합니다.
   * @param rawMessage
   * @returns
   */
  const callbackRemoteChannelMessage = (rawMessage: IMessage) => {
    const message: RemoteChannelMsg = parseRemoteChannelMessage(rawMessage);
    if (!message) {
      return;
    }

    switch (message.type) {
      case 'control':
        // 제어 메세지 업데이트
        if ('score' in message.data && 'givenInjury' in message.data) {
          /**
           * # Callback Ref 사용하는 이유 - loose coupling 을 위해서
           * ContextProvider 가 state 를 직접 변경하면 provider 간 의존성 문제가 생길 수 있습니다.
           * Provider 가 다른 Provider 의 state 를 참조하면 의존성이 복잡해지고 강한 결합이 생깁니다.
           * 따라서 'control' 메세지에 대한 처리 callback 정의를 Provider 가 아니라 다른 하위 컴포넌트에서 하도록 하고,
           * RemoteClientContext 에서는 callback 을 실행시키기만 합니다.
           *
           * # Provider 간 의존성 문제란
           * Provider 에서 직접 다른 Provider 의 state 를 변경하도록 하면 Provider 간 순서가 중요해지는 문제가 발생합니다.
           * 예를 들어 RemoteClientProvider 에서 직접 TeamProvider 의 Team state 를 변경하도록 코드를 작성하면
           * 필수적으로 TeamProvider 안에 RemoteClientProvider 가 위치해야 합니다.
           *
           * <TeamProvider>
           *  <RemoteClientProvider>
           *    <TimerRoot />
           *  </RemoteClientProvider>
           * </TeamProvider>
           *
           * 이로 인해서 provider 간 강한 결합이 발생하므로, loose coupling 을 위해서 Provider 간 state 직접 변경을 지양해야 합니다.
           *
           * # 해결 방법 - onReceiveControlMsgCbRef 를 사용하여 callback 을 TimerRoot 이하의 컴포넌트에서 정의하도록 합니다.
           * 예를 들어 <RemoteClientManager> 를 <TimerRoot> 아래에 위치시키고,
           * <RemoteClientManager> 에서 각종 Provider 의 state 의존성을 받아옵니다.
           * 그리고 <RemoteClientManager> 에서 onReceiveControlMsgCbRef 를 정의하도록 하고,
           * <RemoteClientContext> 에서는 단지 callback 이 정의되어있다면 실행하기만 하면 됩니다.
           * 이렇게 loose coupling 을 구현할 수 있습니다.
           */
          callOnReceiveControlMsgCb(message);
        }
        break;
      case 'members':
        // 멤버 목록 업데이트
        if ('members' in message.data) {
          setMemberNicknames(message.data.members);
        }
        break;
      default:
        break;
    }
  };

  const parseRemoteChannelMessage = (message: IMessage) => {
    let remoteChannelMsg: RemoteChannelMsg;
    try {
      remoteChannelMsg = JSON.parse(message.body);
    } catch (e) {
      return;
    }
    return remoteChannelMsg;
  };

  const callOnReceiveControlMsgCb = (msg: ControlChannelMsg) => {
    if (onReceiveControlMsgCbRef.current) {
      onReceiveControlMsgCbRef.current(msg);
    }
  };

  const setOnReceiveControlMessage = (
    cb: (data: ControlChannelMsg) => void,
  ) => {
    if (cb) {
      onReceiveControlMsgCbRef.current = cb;
    }
  };

  const setRemotePubData = (data: RemoteChannelMsg) => {
    if (data) {
      remotePubDataRef.current = data;
    }
  };

  // 새로운 원격 정보를 받으면
  // 원격 제어 정보 업데이트
  // 새로 원격 채널에 입장했으므로, 채널 닉네임들을 요청합니다.
  useEffect(() => {
    remoteInfosRef.current = remoteInfos;
    requestMemberNicknames();
  }, [remoteInfos]);

  /**
   * RemoteCommon 채널 구독 완료 후에 동작해야 합니다.
   * @param nickname
   * @returns
   */
  const handleInitAutoRemote = (nickname: string, isAutoRemote: boolean) => {
    if (isNotValidNickname(nickname)) {
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
      .then((res) => {
        // 자동 재연결 요청. 성공시 type:connect 응답을 받음
        clientRef.current.publish({
          destination: '/app/remote.autoreconnect',
          body: JSON.stringify({ nickname: nickname }),
        });
      })
      .catch((e) => {
        console.log('쿠키 캐싱 실패, 400 : ', e);
      });
  };

  const saveToLocalStorage = (nickname: string, isAutoRemote: boolean) => {
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('isAutoRemote', JSON.stringify(isAutoRemote));
  };

  const isNotValidNickname = (nickname: string) => {
    const _result = (() => {
      if (!nickname) return true;
      if (typeof nickname !== 'string') return true;
      return new Blob([nickname]).size > 30;
    })();

    return _result;
  };

  const connectAsHost = (nickname: string, isAutoRemote: boolean) => {
    if (!clientRef.current?.connected || !isBasicSubDone) {
      setErrorMsg('general:서버 연결 중입니다. 잠시만 기다려주세요.');
      return;
    }

    nickname = nickname.trim();
    if (isNotValidNickname(nickname)) {
      setErrorMsg('nickname:유효하지 않은 닉네임 입니다. 최대 30자');
      return;
    }

    saveToLocalStorage(nickname, isAutoRemote);
    clientRef.current.publish({
      destination: '/app/remote.issuecode',
      body: JSON.stringify({ nickname: nickname, autoRemote: isAutoRemote }),
    });
  };

  const connectAsMember = (
    nickname: string,
    remoteCode: string,
    isAutoRemote: boolean,
  ) => {
    if (!RemoteUtil.isValideRemoteCode(remoteCode)) {
      setErrorMsg('code:유효하지 않은 원격 코드입니다.');
      return;
    }
    nickname = nickname.trim();
    if (isNotValidNickname(nickname)) {
      setErrorMsg('nickname:유효하지 않은 닉네임 입니다. 최대 30자');
      return;
    }

    saveToLocalStorage(nickname, isAutoRemote);
    clientRef.current.publish({
      destination: '/app/remote.connect',
      body: JSON.stringify({
        remoteCode: remoteCode,
        nickname: nickname,
        autoRemote: isAutoRemote,
      }),
    });
  };

  const publishMessage = () => {
    clientRef.current.publish({
      destination: remoteInfosRef.current.pubPath,
      body: JSON.stringify(remotePubDataRef.current),
    });
  };

  const requestMemberNicknames = () => {
    if (clientRef.current.connected) {
      if (!remoteInfos.pubPath) return;

      clientRef.current.publish({
        destination: remoteInfos.pubPath + '/members',
        body: JSON.stringify({}),
      });
    }
  };

  const cleanErrorMsg = (ms: number) => {
    ms = Number.parseInt(ms.toString());
    if (ms < 0) ms = 0;

    setTimeout(() => {
      setErrorMsg('');
    }, ms);
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
    setIsCleaning(true);

    let response: AxiosResponse<any>;
    try {
      response = await axios.post(
        `${Urls.apiUrl}/api/scoreboard/user/cookie/clear`,
        {},
        { withCredentials: true },
      );
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem('nickname', '기본닉네임');
    localStorage.setItem('isAutoRemote', 'false');
    setNickname('기본닉네임');
    setIsAutoRemote(false);
    setRemoteCode('');
    setRemoteInfos({
      subPath: '',
      subId: '',
      pubPath: '',
    });
    setErrorMsg('');
    setMemberNicknames([]);

    return response;
  };

  useEffect(() => {
    if (isCleaning && isAllCleaned()) {
      setIsCleaning(false);
      restartClient();
    }
  }, [
    nickname,
    isAutoRemote,
    remoteCode,
    remoteInfos,
    errorMsg,
    memberNicknames,
  ]); // 상태들을 의존성 배열에 포함

  const restartClient = async () => {
    if (clientRef.current) {
      await clientRef.current.deactivate();
    }
    initStompClient();
  };

  const isAllCleaned = () => {
    return (
      localStorage.getItem('nickname') === '기본닉네임' &&
      localStorage.getItem('isAutoRemote') === 'false' &&
      nickname === '기본닉네임' &&
      isAutoRemote === false &&
      remoteCode === '' &&
      remoteInfos.subPath === '' &&
      remoteInfos.subId === '' &&
      remoteInfos.pubPath === '' &&
      errorMsg === '' &&
      memberNicknames.length === 0
    );
  };

  const getStoredInfos = () => {
    const nick = localStorage.getItem('nickname') || '기본닉네임';
    const isAutoRemote = JSON.parse(
      localStorage.getItem('isAutoRemote') || 'false',
    );
    return { nickname: nick, isAutoRemote: isAutoRemote };
  };

  return (
    <RemoteClientContext.Provider
      value={{
        clientRef,
        initStompClient,
        clearAll,
        setOnReceiveControlMessage,
        setRemotePubData,
        publishMessage,
        connectAsHost,
        connectAsMember,
        isNotValidNickname,
        updateNickname,
        updateIsAutoRemote,
        getStoredInfos,
        memberNicknames,
        remoteCode,
        remoteInfos,
        isBasicSubDone,
        isRemoteConnected,
        errorMsg,
        cleanErrorMsg,
      }}
    >
      {children}
    </RemoteClientContext.Provider>
  );
};
