import React from 'react';

import '@styles/control/ScoreControlPanel.scss';

import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';

const ScoreControlPanel: React.FC<Record<string, never>> = () => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  // Team A 골 조작
  const handleGoalChangeA = (change: number) => {
    updateTeamA('score', teamA.score + change >= 0 ? teamA.score + change : 0); // 골은 0 이하가 되지 않도록 조건 추가
  };

  // Team B 골 조작
  const handleGoalChangeB = (change: number) => {
    updateTeamB('score', teamB.score + change >= 0 ? teamB.score + change : 0); // 골은 0 이하가 되지 않도록 조건 추가
  };

  return (
    <div className='board-control-container'>
      {/* Team A Control */}
      <div className='board-control-team-a'>
        <div className='score-control'>
          <h3>Team A</h3>
          <div className='score-adjust-button-group'>
            <button onClick={() => handleGoalChangeA(1)}>골+</button>
            <button onClick={() => handleGoalChangeA(-1)}>골-</button>
          </div>
        </div>
      </div>
      {/* Team B Control */}
      <div className='board-control-team-b'>
        <div className='score-control'>
          <h3>Team B</h3>
          <div className='score-adjust-button-group'>
            <button onClick={() => handleGoalChangeB(1)}>골+</button>
            <button onClick={() => handleGoalChangeB(-1)}>골-</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreControlPanel;
