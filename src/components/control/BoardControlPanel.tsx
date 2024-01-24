import React, { ChangeEvent } from 'react';

import '@styles/control/BoardControlPanel.scss';

import 'flag-icons/css/flag-icons.min.css';
import ScoreControlPanel from './ScoreControlPanel';
import InfoPanel from './InfoPanel';

const BoardControlPanel: React.FC<Record<string, never>> = () => {
  return (
    <div className='board-control-panel-wrapper'>
      <ScoreControlPanel />
      <InfoPanel />
    </div>
  );
};

export default BoardControlPanel;
