import React from 'react';
import RemoteControlTab from './RemoteControlBox';
import RemoteReceiveTab from './RemoteReceiveBox';
import '@styles/remote/RemoteTab.scss';

const RemoteTab = () => {
  return (
    <div className='remote-tab-container'>
      <div className='remote-receive-wrapper'>
        <RemoteReceiveTab />
      </div>
      <div className='remote-control-wrapper'>
        <RemoteControlTab />
      </div>
    </div>
  );
};

export default RemoteTab;
