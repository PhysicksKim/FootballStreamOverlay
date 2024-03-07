import React, { useEffect, useState } from 'react';
import { ConnectStatus } from '@src/types/stompTypes';

import '@styles/remote/RemoteHostBox.scss';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Urls } from '@src/classes/Utils';
import { cli } from 'webpack';

const RemoteClientBox = () => {
  const {
    clientRef,
    remoteInfos,
    remoteCode,
    isConnected,
    hostClient,
    memberClient,
  } = useRemoteClient();

  const [nicknameInput, setNicknameInput] = useState('');
  const [isAutoRemote, setIsAutoRemote] = useState(false);

  const [stompStatus, setStompStatus] = useState<ConnectStatus>('연결됨');
  const [remotecodeInput, setRemotecodeInput] = useState('');

  const [existCookie, setExistCookie] = useState(false);

  useEffect(() => {
    autoRemoteUserCookieCachingToServer();
  }, []);

  useEffect(() => {
    if (isConnected) {
      setStompStatus('연결됨');
    } else {
      setStompStatus('끊어짐');
    }
  }, [isConnected]);

  const autoRemoteUserCookieCachingToServer = async () => {
    axios
      .post(
        Urls.apiUrl + '/api/scoreboard/user/cookie',
        {},
        { withCredentials: true },
      )
      .then((res) => {
        console.log('cookie exist');
        setExistCookie(true);
      })
      .catch((err) => {
        console.log('cookie not exist');
        setExistCookie(false);
      });
  };

  const isNotReadyWebsocket = () => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.log('clientRef is not set');
      return true;
    }
    return false;
  };

  const connectSocketHandler = () => {
    if (!clientRef.current) {
      console.error('clientRef is not set');
      return;
    }
    if (isConnected) {
      console.log('client is already connected. please disconnect first.');
      return;
    }

    if (!clientRef.current.connected) {
      clientRef.current.activate();
    }
  };

  const disconnectHandler = () => {
    if (isNotReadyWebsocket()) return;

    clientRef.current.deactivate();
  };

  // #region HostClient
  const issueCodeHandler = () => {
    if (isNotReadyWebsocket()) return;

    hostClient.connectAsHost(nicknameInput.trim(), isAutoRemote);
  };

  // #region MemberClient
  const codeConnectHandler = () => {
    if (!remotecodeInput) {
      console.log('input is empty');
      return;
    }

    memberClient.connectAsMember(
      remotecodeInput,
      nicknameInput.trim(),
      isAutoRemote,
    );
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoRemote(event.target.checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value.split(' ').join('');
    setNicknameInput(updatedValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // 붙여넣기 이벤트에서 텍스트 데이터를 가져옵니다.
    const pasteText = e.clipboardData.getData('text');
    // 공백을 제거합니다.
    const updatedValue = pasteText.split(' ').join('');
    // 기본 붙여넣기 동작을 방지합니다.
    e.preventDefault();
    // 공백이 제거된 텍스트를 상태에 설정합니다.
    setNicknameInput(updatedValue);
  };

  const connectAutoRemoteConnect = () => {
    // STOMP destination : /app/remote.autoreconnect
    // 로 원격 자동 연결을 요청합니다.
    // body 에는 nickname 을 포함해 전송합니다.
    clientRef.current.publish({
      destination: '/app/remote.autoreconnect',
      body: JSON.stringify({ nickname: nicknameInput }),
    });
  };

  return (
    <div className='remote-receive-tab-container'>
      <div className='nickname-input-box'>
        <input
          type='text'
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder='닉네임'
          value={nicknameInput}
        />
        <input
          style={{ WebkitTransform: 'scale(1.5)' }}
          type='checkbox'
          id='is-auto-group'
          checked={isAutoRemote}
          onChange={handleCheckboxChange}
        />
        <input
          type='button'
          value='자동원격연결'
          onClick={connectAutoRemoteConnect}
        />
      </div>
      <div className='websocket-connect-box'>
        <h2>원격 수신</h2>
        <div>웹소켓 상태</div>
        <button onClick={connectSocketHandler}>연결</button>
        <button onClick={disconnectHandler}>연결종료</button>
        <div className='websocket-status'>{stompStatus}</div>
      </div>
      <div className='remote-host-box'>
        <div className='group-box'>
          <div>코드 발급</div>
          <button onClick={issueCodeHandler}>발급</button>
        </div>
      </div>
      <div className='remote-member-box'>
        <div className='group-box'>
          <div>코드 연결</div>
          <input
            type='text'
            id='remote-connect-code-input'
            onChange={(e) => setRemotecodeInput(e.target.value)}
          />
          <button onClick={codeConnectHandler}>연결</button>
        </div>
      </div>
      <div className='remote-infos-box'>
        <div className='group-box'>
          <div>코드 값</div>
          <div> : [ {remoteCode} ]</div>
        </div>
        <div className='group-box'>
          <div>subPath</div>
          <div> : [ {remoteInfos.subPath} ]</div>
        </div>
        <div className='group-box'>
          <div>pubPath</div>
          <div> : [ {remoteInfos.pubPath} ]</div>
        </div>
      </div>
    </div>
  );
};

export default RemoteClientBox;
