import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTowerBroadcast, faSlash } from '@fortawesome/free-solid-svg-icons';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

import '@styles/control/lowerPanel/RemotePubPanel.scss';

type RemoteStatus = '끊어짐' | '연결됨';

const RemotePubPanel: React.FC<Record<string, never>> = () => {
  const {
    clientRef,
    remoteInfos,
    remoteCode,
    isConnected,
    eventEmitterRef,
    publishMessage,
    emitRemoteControlMsg,
    hostClient,
    memberClient,
  } = useRemoteClient();
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>('끊어짐');

  useEffect(() => {
    setRemoteStatus(isConnected ? '연결됨' : '끊어짐');
  }, [isConnected]);

  const handleRemoteSend = () => {
    if (isConnected) emitRemoteControlMsg();
  };

  return (
    <div className='remote-pub-box-container'>
      <div className='remote-pub-wrapper'>
        <div className='remote-title'>
          <div className='remote-title-text'>원격제어</div>
        </div>
        <div className='remote-connect-status'>
          <div className='remote-connect-status-title'>상태</div>
          <div
            className={`remote-connect-status-text ${
              remoteStatus === '끊어짐' ? 'remote-disconnect' : 'remote-connect'
            }`}
          >
            {remoteStatus}
          </div>
          <div className='remote-connect-status-icon'>
            <FontAwesomeIcon
              icon={faTowerBroadcast}
              className={`broadcast ${
                remoteStatus === '끊어짐'
                  ? 'remote-disconnect'
                  : 'remote-connect'
              }`}
            />
            <FontAwesomeIcon
              icon={faSlash}
              className={`slash ${
                remoteStatus === '끊어짐'
                  ? 'remote-disconnect'
                  : 'remote-slash-hidden'
              }`}
            />
          </div>
        </div>
        <div className='remote-send-btn'>
          <button
            id='send-control-msg-btn'
            onClick={handleRemoteSend}
            disabled={!isConnected}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemotePubPanel;
