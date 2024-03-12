import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTowerBroadcast, faSlash } from '@fortawesome/free-solid-svg-icons';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

import '@styles/control/lowerPanel/RemotePubPanel.scss';
import Tooltip from '@src/components/common/Tooltip';

type RemoteStatus = '끊어짐' | '연결됨';

const RemotePubPanel: React.FC<Record<string, never>> = () => {
  const { isRemoteConnected, publishMessage } = useRemoteClient();
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>('끊어짐');
  const [showSendToolTip, setShowSendToolTip] = useState(false);

  useEffect(() => {
    setRemoteStatus(isRemoteConnected ? '연결됨' : '끊어짐');
  }, [isRemoteConnected]);

  const handleRemoteSend = () => {
    if (isRemoteConnected) {
      publishMessage();
      setShowSendToolTip(true);
      setTimeout(() => {
        setShowSendToolTip(false);
      }, 1500);
    }
  };

  return (
    <div className='remote-pub-box-container'>
      <div className='remote-pub-wrapper'>
        <div className='remote-title'>
          <div className='remote-title-text'>원격제어</div>
        </div>
        <div className='remote-connect-status'>
          <div className='remote-connect-status-title'>원격채널</div>
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
            disabled={!isRemoteConnected}
          >
            전송
          </button>
          <Tooltip
            show={showSendToolTip}
            message='전송 완료'
            position='top'
            align='center'
            color='success'
          ></Tooltip>
        </div>
      </div>
    </div>
  );
};

export default RemotePubPanel;
