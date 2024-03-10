import React, { useCallback, useEffect, useState } from 'react';
import { ConnectStatus } from '@src/types/stompTypes';

import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

import '@styles/remote/RemoteClientBox.scss';
import Tooltip from '../common/Tooltip';

const RemoteClientBox = () => {
  const {
    clientRef,
    remoteInfos,
    remoteCode,
    isConnected,
    hostClient,
    memberClient,
    autoRemote,
    error: remoteError,
    clearAll,
    memberNicknames,
  } = useRemoteClient();

  const [nicknameInput, setNicknameInput] = useState(autoRemote.nickname);
  const [isAutoRemoteInput, setIsAutoRemoteInput] = useState(
    autoRemote.isAutoRemote,
  );

  const [stompStatus, setStompStatus] = useState<ConnectStatus>('연결됨');
  const [remotecodeInput, setRemotecodeInput] = useState('');

  // error tooltip 표시
  const [nicknameErrorTooltip, setNicknameErrorTooltip] = useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [codeErrorTooltip, setCodeErrorTooltip] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState('');
  const [generalErrorTooltip, setGeneralErrorTooltip] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');

  useEffect(() => {
    if (isConnected) {
      setStompStatus('연결됨');
    } else {
      setStompStatus('끊어짐');
    }
  }, [isConnected]);

  // 툴팁 표시 후 3초 뒤에 사라지게 함
  useEffect(() => {
    if (nicknameErrorTooltip) {
      setTimeout(() => {
        setNicknameErrorTooltip(false);
      }, 3000);
    }
    if (codeErrorTooltip) {
      setTimeout(() => {
        setCodeErrorTooltip(false);
      }, 3000);
    }
    if (generalErrorTooltip) {
      setTimeout(() => {
        setGeneralErrorTooltip(false);
      }, 3000);
    }
  }, [nicknameErrorTooltip, codeErrorTooltip, generalErrorTooltip]);

  useEffect(() => {
    const _split = remoteError.message?.split(':');
    const errorType = _split[0]?.trim();
    const errorMsg = _split[1]?.trim();
    switch (errorType) {
      case 'nickname':
        setNicknameErrorTooltip(true);
        setTimeout(() => {
          setNicknameErrorTooltip(false);
        }, 3000);
        setNicknameErrorMessage(errorMsg);
        break;
      case 'code':
        setCodeErrorTooltip(true);
        setTimeout(() => {
          setCodeErrorTooltip(false);
        }, 3000);
        setCodeErrorMessage(errorMsg);
        break;
      case 'general': // 'general'
        setGeneralErrorTooltip(true);
        setTimeout(() => {
          setGeneralErrorTooltip(false);
        }, 3000);
        setGeneralErrorMessage(errorMsg);
        break;
      default:
        break;
    }
    setTimeout(() => {
      remoteError.updateMessage('');
    }, 0);
  }, [remoteError.message]);

  useEffect(() => {
    autoRemote.updateNickname(nicknameInput);
  }, [nicknameInput]);

  useEffect(() => {
    autoRemote.updateIsAutoRemote(isAutoRemoteInput);
  }, [isAutoRemoteInput]);

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
    hostClient.connectAsHost(autoRemote.nickname, autoRemote.isAutoRemote);
  };

  // #region MemberClient
  const codeConnectHandler = () => {
    memberClient.connectAsMember(
      remotecodeInput,
      autoRemote.nickname,
      autoRemote.isAutoRemote,
    );
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoRemoteInput(event.target.checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value.split(' ').join('');
    setNicknameInput(updatedValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteText = e.clipboardData.getData('text');
    const updatedValue = pasteText.split(' ').join('');
    e.preventDefault();
    setNicknameInput(updatedValue);
  };

  const connectAutoRemoteConnect = () => {
    // STOMP destination : /app/remote.autoreconnect
    // 로 원격 자동 연결을 요청합니다.
    // body 에는 nickname 을 포함해 전송합니다.
    clientRef.current.publish({
      destination: '/app/remote.autoreconnect',
      body: JSON.stringify({ nickname: autoRemote.nickname }),
    });
  };

  const changeRemoteCodeInputHandler = (value: string) => {
    value = value.split(' ').join('');
    setRemotecodeInput(value);
  };

  const clearAllHandler = () => {
    clearAll()
      .then(() => {
        console.log('success clear All (expire cookie)');
      })
      .catch((e) => {
        console.error(e);
      });

    setNicknameInput('');
    setRemotecodeInput('');
    setIsAutoRemoteInput(false);
  };

  const getMembersHandler = () => {
    clientRef.current.publish({
      destination: remoteInfos.pubPath + '/members',
      body: JSON.stringify({}),
    });
  };

  return (
    <div className='remote-receive-tab-container'>
      <Tooltip
        show={generalErrorTooltip}
        message={generalErrorMessage}
        position='top'
        align='left'
      />
      <div className='remote-info-input-box'>
        <div className='nickname-input-box'>
          <label htmlFor='nickname-input'>닉네임</label>
          <div className='nickname-input-wrapper'>
            <input
              type='text'
              id='nickname-input'
              placeholder='닉네임 입력'
              value={nicknameInput}
              onChange={handleChange}
              onPaste={handlePaste}
            />
            <Tooltip
              show={nicknameErrorTooltip}
              message={nicknameErrorMessage}
              position='top'
            />
          </div>
        </div>
        <div className='autoremote-check-wrapper'>
          <label htmlFor='is-auto-group'>자동 연결을 생성하시겠습니까? </label>
          <div className='autoremote-check-input-wrapper'>
            <input
              style={{ WebkitTransform: 'scale(1.5)' }}
              type='checkbox'
              id='is-auto-group'
              checked={isAutoRemoteInput}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>
      <div className='create-and-join-box'>
        <div className='create-box'>
          <button className='create-group-btn' onClick={issueCodeHandler}>
            생성
          </button>
          <div className='create-group-code-display'>
            코드 : [ {remoteCode} ]
          </div>
          <div className='create-group-title'>신규 그룹 생성</div>
        </div>
        <div className='join-box'>
          <button className='join-group-btn' onClick={codeConnectHandler}>
            참여
          </button>
          <div className='join-group-input-wrapper'>
            <input
              type='text'
              id='remote-connect-code-input'
              className='join-group-code-input'
              value={remotecodeInput}
              onChange={(e) => changeRemoteCodeInputHandler(e.target.value)}
            />
            <Tooltip
              show={codeErrorTooltip}
              message={codeErrorMessage}
              position='bottom'
              align='center'
            />
          </div>
          <div className='join-group-title'>코드로 참여</div>
        </div>
      </div>
      {/* <button
        onClick={() => {
          setNicknameErrorTooltip(true);
          setCodeErrorTooltip(true);
          setGeneralErrorTooltip(true);
        }}
      >
        Dedug_showTooltips
      </button> */}
      <div className='remote-clear-all-box'>
        <button className='remote-clear-all-btn' onClick={clearAllHandler}>
          초기화
        </button>
        {/* <button className='remote-members-btn' onClick={getMembersHandler}>
          Debug Retrieve Members
        </button> */}
      </div>
    </div>
  );
};

export default RemoteClientBox;
