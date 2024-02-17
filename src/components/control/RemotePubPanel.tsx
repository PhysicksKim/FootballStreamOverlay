import React, { useState, useEffect } from 'react';

import '@styles/control/RemotePubPanel.scss';
import { useRemoteHostClient } from '@src/contexts/stomp/RemoteHostClientContext';
import { useRemoteMemberClient } from '@src/contexts/stomp/RemoteMemberClientContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTowerBroadcast, faSlash } from '@fortawesome/free-solid-svg-icons';

type RemoteStatus = '끊어짐' | '수신중' | '송신중';

const RemotePubPanel: React.FC<Record<string, never>> = () => {
  const { isConnected: isSubConnected, emitRemoteControlMsg: emitHost } =
    useRemoteHostClient();
  const { isConnected: isPubConnected, emitRemoteControlMsg: emitMember } =
    useRemoteMemberClient();
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>('끊어짐');

  useEffect(() => {
    console.log('isSubConnected', isSubConnected);
    console.log('isPubConnected', isPubConnected);
    setRemoteStatus(
      isSubConnected ? '수신중' : isPubConnected ? '송신중' : '끊어짐',
    );
  }, [isSubConnected, isPubConnected]);

  const handleRemoteSend = () => {
    if (isSubConnected) emitHost();
    else if (isPubConnected) emitMember();
  };

  return (
    <div className='remote-pub-box-container'>
      <div className='remote-pub-content'>
        <div className='remote-title'>
          <div className='remote-title-text'>원격 연결</div>
        </div>
        <div className='remote-connect-status'>
          <div className='remote-connect-status-title'>상태</div>
          <div
            className={`remote-connect-status-text ${
              remoteStatus === '끊어짐'
                ? 'remote-disconnect'
                : remoteStatus === '수신중'
                ? 'remote-subscribe'
                : 'remote-publish'
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
                  : remoteStatus === '수신중'
                  ? 'remote-subscribe'
                  : 'remote-publish'
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
            disabled={!isPubConnected}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemotePubPanel;
