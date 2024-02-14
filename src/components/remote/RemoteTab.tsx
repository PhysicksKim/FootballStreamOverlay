import React from 'react';
import RemoteControlBox from './RemoteControlBox';
import RemoteReceiveBox from './RemoteReceiveBox';
import '@styles/remote/RemoteTab.scss';

const RemoteTab = () => {
  return (
    <div className='remote-tab-container'>
      <div className='remote-receive-wrapper'>
        <RemoteReceiveBox />
      </div>
      <div className='remote-control-wrapper'>
        <RemoteControlBox />
      </div>
    </div>
  );
};

export default RemoteTab;
