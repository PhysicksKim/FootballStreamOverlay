import React from 'react';
import '@styles/remote/RemoteTab.scss';
import RemoteClientBox from './RemoteClientBox';

const RemoteTab = () => {
  return (
    <div className='remote-tab-container'>
      <div className='remote-control-wrapper'>
        <RemoteClientBox />
      </div>
    </div>
  );
};

export default RemoteTab;
