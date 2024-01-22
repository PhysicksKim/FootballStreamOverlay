import React, { useState } from 'react';
import '@styles/control/ControlPanel.scss';
import TimerControlPanel from './TimerControlPanel';
import BoardControlPanel from './BoardControlPanel';
import { Team, TimerManager } from '../TimerRoot';

interface ControlPanelProps {
  mainTimerWrapper: TimerManager;
  injuryTimerWrapper: TimerManager;
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
  teamA: Team;
  teamB: Team;
  updateTeamA: <K extends keyof Team>(key: K, value: Team[K]) => void;
  updateTeamB: <K extends keyof Team>(key: K, value: Team[K]) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mainTimerWrapper,
  injuryTimerWrapper,
  showInjuryTimer,
  disappearInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
  teamA,
  teamB,
  updateTeamA,
  updateTeamB,
}) => {
  return (
    // TODO : epl 팀 추가하면 이제 control panel 이 변경될 수 있도록 해야함.
    // 지금은 [타이머+팀선택] 으로 페이지 하나인데
    // 나중에 [타이머] [팀선택] 으로 페이지 두 개 만들어야 할듯함
    // ++ 팀선택 이전에 EPL 로고부터 해결해야 할듯?
    <div className='control-panel-container'>
      <div className='timer-control-wrapper'>
        <TimerControlPanel
          mainTimerWrapper={mainTimerWrapper}
          injuryTimerWrapper={injuryTimerWrapper}
          showInjuryTimer={showInjuryTimer}
          disappearInjuryTimer={disappearInjuryTimer}
          isShowInjuryTimer={isShowInjuryTimer}
          updateGivenInjuryTime={updateGivenInjuryTime}
          updateMatchName={updateMatchName}
        />
      </div>
      <div className='board-control-wrapper'>
        <BoardControlPanel
          teamA={teamA}
          teamB={teamB}
          updateTeamA={updateTeamA}
          updateTeamB={updateTeamB}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
