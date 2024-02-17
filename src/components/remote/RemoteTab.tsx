import React from 'react';
import RemoteMemberBox from './RemoteMemberBox';
import RemoteHostBox from './RemoteHostBox';
import '@styles/remote/RemoteTab.scss';

const RemoteTab = () => {
  return (
    <div className='remote-tab-container'>
      <div className='remote-receive-wrapper'>
        <RemoteHostBox />
      </div>
      <div className='remote-control-wrapper'>
        <RemoteMemberBox />
      </div>
    </div>
  );
};

export default RemoteTab;
