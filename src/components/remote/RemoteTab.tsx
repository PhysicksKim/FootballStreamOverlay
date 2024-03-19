import React from 'react';
import '@styles/remote/RemoteTab.scss';
import RemoteClientBox from './RemoteClientBox';
import RemoteMembersBox from './RemoteMembersBox';

const RemoteTab = () => {
  return (
    <div className='remote-tab-container'>
      <RemoteClientBox />
      <RemoteMembersBox />
    </div>
  );
};

export default RemoteTab;
