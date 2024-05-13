import React from 'react';
import '@styles/control/ControlPanel.scss';
import TimerControlPanel from './upperPanel/TimerControlPanel';
import BoardControlPanel from './lowerPanel/BoardControlPanel';

interface LiveControlTabProps {
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const LiveControlTab: React.FC<LiveControlTabProps> = ({
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  return (
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          updateGivenInjuryTime={updateGivenInjuryTime}
          updateMatchName={updateMatchName}
        />
      </div>
      {/* <BoardControlPanel /> */}
      <div className='board-control-wrapper'>
        <BoardControlPanel />
      </div>
    </div>
  );
};

export default React.memo(LiveControlTab);
