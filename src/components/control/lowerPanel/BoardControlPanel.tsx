import React from 'react';

import RemotePubPanel from './RemotePubPanel';
import ScoreInjuryBox from './ScoreInjuryBox';

import '@styles/control/lowerPanel/BoardControlPanel.scss';

const BoardControlPanel: React.FC<Record<string, never>> = () => {
  return (
    <div className='board-control-panel-wrapper'>
      <div className='score-given-injury-box'>
        <ScoreInjuryBox />
      </div>
      <div className='remote-pub-box'>
        <RemotePubPanel />
      </div>
    </div>
  );
};

export default BoardControlPanel;
