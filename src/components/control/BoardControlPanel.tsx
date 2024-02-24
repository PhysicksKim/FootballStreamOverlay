import React from 'react';

import '@styles/control/BoardControlPanel.scss';

import 'flag-icons/css/flag-icons.min.css';
import ScoreControlPanel from './ScoreControlPanel';
import InfoPanel from './InfoPanel';
import RemotePubPanel from './RemotePubPanel';

const BoardControlPanel: React.FC<Record<string, never>> = () => {
  return (
    <div className='board-control-panel-wrapper'>
      {/* <div className='score-control-panel-box'>
        <ScoreControlPanel />
      </div>
      <div className='info-panel-box'>
        <InfoPanel />
      </div> */}
      <div>스코어 버튼, 주어진 인저리 타임 지정</div>
      <div className='remote-pub-box'>
        <RemotePubPanel />
      </div>
    </div>
  );
};

export default BoardControlPanel;
