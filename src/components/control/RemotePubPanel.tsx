import React, { useState, useEffect } from 'react';

import '@styles/control/RemotePubPanel.scss';
import { useStompBoardClient } from '@src/contexts/stomp/StompBoardClientContext';
import { useStompControlClient } from '@src/contexts/stomp/StompControlClientContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTowerBroadcast, faSlash } from '@fortawesome/free-solid-svg-icons';

type RemoteStatus = '끊어짐' | '수신중' | '송신중';

const RemotePubPanel: React.FC<Record<string, never>> = () => {
  const { isConnected: isSubConnected } = useStompBoardClient();
  const { isConnected: isPubConnected, publishNowStates } =
    useStompControlClient();
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>('끊어짐');

  useEffect(() => {
    console.log('isSubConnected', isSubConnected);
    console.log('isPubConnected', isPubConnected);
    setRemoteStatus(
      isSubConnected ? '수신중' : isPubConnected ? '송신중' : '끊어짐',
    );
  }, [isSubConnected, isPubConnected]);

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
            onClick={publishNowStates}
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
