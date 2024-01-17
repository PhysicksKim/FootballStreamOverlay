import React, { useState } from 'react';
import '../styles/ControlPanel.scss';
import TimerControlPanel from './TimerControlPanel';
import BoardControlPanel from './BoardControlPanel';

interface ControlPanelProps {
  updateTime: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  updateTime,
  pauseTimer,
  resumeTimer,
}) => {
  return (
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          updateTime={updateTime}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
        />
      </div>
      <div className='board-control-wrapper'>
        <BoardControlPanel />
      </div>
    </div>
  );
};

export default ControlPanel;
