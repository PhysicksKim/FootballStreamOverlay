import React, { useState } from 'react';
import '../../styles/ControlPanel.scss';
import TimerControlPanel from './TimerControlPanel';
import BoardControlPanel from './BoardControlPanel';
import { TimerWrapper } from '../TimerRoot';

interface ControlPanelProps {
  mainTimerWrapper: TimerWrapper;
  injuryTimerWrapper: TimerWrapper;
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mainTimerWrapper,
  injuryTimerWrapper,
  showInjuryTimer,
  disappearInjuryTimer,
}) => {
  return (
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          mainTimerWrapper={mainTimerWrapper}
          injuryTimerWrapper={injuryTimerWrapper}
          showInjuryTimer={showInjuryTimer}
          disappearInjuryTimer={disappearInjuryTimer}
        />
      </div>
      <div className='board-control-wrapper'>
        <BoardControlPanel />
      </div>
    </div>
  );
};

export default ControlPanel;
