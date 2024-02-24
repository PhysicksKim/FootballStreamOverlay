import React from 'react';
import '@styles/control/ControlPanel.scss';
import TimerControlPanel from './timerPanel/TimerControlPanel';
import BoardControlPanel from './BoardControlPanel';

interface LiveControlTabProps {
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const LiveControlTab: React.FC<LiveControlTabProps> = ({
  showInjuryTimer,
  disappearInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  return (
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          showInjuryTimer={showInjuryTimer}
          disappearInjuryTimer={disappearInjuryTimer}
          isShowInjuryTimer={isShowInjuryTimer}
          updateGivenInjuryTime={updateGivenInjuryTime}
          updateMatchName={updateMatchName}
        />
      </div>
      <div className='board-control-wrapper'>
        <BoardControlPanel />
      </div>
    </div>
  );
};

export default LiveControlTab;
