import React, { useState } from 'react';
import '../../styles/control/ControlPanel.scss';
import TimerControlPanel from './TimerControlPanel';
import BoardControlPanel from './BoardControlPanel';
import { Team, TimerWrapper } from '../TimerRoot';

interface ControlPanelProps {
  mainTimerWrapper: TimerWrapper;
  injuryTimerWrapper: TimerWrapper;
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  setMatchName: React.Dispatch<React.SetStateAction<string>>;
  teamA: Team;
  teamB: Team;
  setTeamA: React.Dispatch<React.SetStateAction<Team>>;
  setTeamB: React.Dispatch<React.SetStateAction<Team>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mainTimerWrapper,
  injuryTimerWrapper,
  showInjuryTimer,
  disappearInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  setMatchName,
  teamA,
  teamB,
  setTeamA,
  setTeamB,
}) => {
  return (
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          mainTimerWrapper={mainTimerWrapper}
          injuryTimerWrapper={injuryTimerWrapper}
          showInjuryTimer={showInjuryTimer}
          disappearInjuryTimer={disappearInjuryTimer}
          isShowInjuryTimer={isShowInjuryTimer}
          updateGivenInjuryTime={updateGivenInjuryTime}
          setMatchName={setMatchName}
        />
      </div>
      <div className='board-control-wrapper'>
        <BoardControlPanel
          teamA={teamA}
          teamB={teamB}
          setTeamA={setTeamA}
          setTeamB={setTeamB}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
