import React, { useState } from 'react';
import '../styles/ControlPanel.scss';
import TimerControlPanel from './TimerControlPanel';
import BoardControlPanel from './BoardControlPanel';

interface ControlPanelProps {
  updateTime: (time: { min: number; sec: number }) => void;
  stopTime: () => void;
  restartTime: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  updateTime,
  stopTime,
  restartTime,
}) => {
  return (
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          updateTime={updateTime}
          stopTime={stopTime}
          restartTime={restartTime}
        />
      </div>
      <div className='board-control-wrapper'>
        <BoardControlPanel />
      </div>
    </div>
  );
};

export default ControlPanel;
