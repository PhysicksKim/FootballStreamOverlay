import React, { useEffect, useState } from 'react';

import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

import '@styles/remote/RemoteClientBox.scss';
import Tooltip from '../common/Tooltip';

const RemoteClientBox = () => {
  const {
    clientRef,
    connectAsHost,
    connectAsMember,
    updateNickname,
    updateIsAutoRemote,
    errorMsg: remoteErrorMsg,
    getStoredInfos,
    clearAll,
    remoteCode,
    cleanErrorMsg,
  } = useRemoteClient();

  const [nicknameInput, setNicknameInput] = useState(getStoredInfos().nickname);
  const [isAutoRemoteInput, setIsAutoRemoteInput] = useState(
    getStoredInfos().isAutoRemote,
  );
  const [remotecodeInput, setRemotecodeInput] = useState('');

  // error tooltip 표시
  const [nicknameErrorTooltip, setNicknameErrorTooltip] = useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [codeErrorTooltip, setCodeErrorTooltip] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState('');
  const [generalErrorTooltip, setGeneralErrorTooltip] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');

  const [isConnected, setIsConnected] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (clientRef.current?.connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [clientRef.current?.connected]);

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
    const _split = remoteErrorMsg?.split(':');
    const errorType = _split[0]?.trim();
    const errorMsg = _split[1]?.trim();
    switch (errorType) {
      case 'nickname':
        setNicknameErrorTooltip(true);
        setTimeout(() => {
          setNicknameErrorTooltip(false);
          cleanErrorMsg(0);
        }, 3000);
        setNicknameErrorMessage(errorMsg);
        break;
      case 'code':
        setCodeErrorTooltip(true);
        setTimeout(() => {
          setCodeErrorTooltip(false);
          cleanErrorMsg(0);
        }, 3000);
        setCodeErrorMessage(errorMsg);
        break;
      case 'general':
        setGeneralErrorTooltip(true);
        setTimeout(() => {
          setGeneralErrorTooltip(false);
          cleanErrorMsg(0);
        }, 3000);
        setGeneralErrorMessage(errorMsg);
        break;
      case 'noshow':
      default:
        setTimeout(() => {
          cleanErrorMsg(0);
        }, 3000);
        break;
    }
  }, [remoteErrorMsg]);

  useEffect(() => {
    updateNickname(nicknameInput);
  }, [nicknameInput]);

  useEffect(() => {
    updateIsAutoRemote(isAutoRemoteInput);
  }, [isAutoRemoteInput]);

  const isNotReadyWebsocket = () => {
    if (!clientRef.current || !clientRef.current.connected) {
      return true;
    }
    return false;
  };

  const issueCodeHandler = () => {
    connectAsHost(nicknameInput, isAutoRemoteInput);
  };

  const codeConnectHandler = () => {
    connectAsMember(nicknameInput, remotecodeInput, isAutoRemoteInput);
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

  const changeRemoteCodeInputHandler = (value: string) => {
    value = value.split(' ').join('');
    setRemotecodeInput(value);
  };

  const handleConfirmClear = () => {
    clearAll().catch((e) => {
      console.error(e);
    });

    setNicknameInput('');
    setRemotecodeInput('');
    setIsAutoRemoteInput(false);
    setShowConfirm(false);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
  };

  const handleClearClick = () => {
    setShowConfirm(true);
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
      <div className='remote-clear-all-box'>
        <button
          className='remote-clear-all-btn'
          onClick={handleClearClick}
          disabled={showConfirm}
        >
          초기화
        </button>
        {showConfirm && (
          <div className='confirm-box'>
            <div className='confirm-text'>정말 초기화 하시겠습니까?</div>
            <div className='confirm-btn-box'>
              <button
                className='confirm-btn confirm-yes-btn'
                onClick={handleConfirmClear}
              >
                예
              </button>
              <button
                className='confirm-btn confirm-no-btn'
                onClick={handleConfirmCancel}
              >
                아니오
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoteClientBox;
