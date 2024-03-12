import React, { useCallback, useEffect, useState } from 'react';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

import '@styles/remote/RemoteMembersBox.scss';

const RemoteMembersBox = () => {
  const { memberNicknames } = useRemoteClient();

  return (
    <div className='remote-members-container'>
      <div className='remote-members-title'>원격 멤버</div>
      <div className='remote-members-list-box'>
        <ul className='memberList'>
          {memberNicknames.map((member, index) => (
            <li key={`key_${member}`} className='remote-member'>
              {member}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/*
  return (
    <div className="memberListContainer">
      <ul className="memberList">
        {members.map((member, index) => (
          <li key={index} className="memberListItem">
            {member}
          </li>
        ))}
      </ul>
    </div>
  );
*/

export default RemoteMembersBox;
