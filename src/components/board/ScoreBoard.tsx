import React, { useEffect } from 'react';
import { Flag } from '@src/components/styledcomponents/TeamFlag';

import '@styles/board/ScoreBoard.scss';
import '@styles/board/TeamAStyles.scss';
import '@styles/board/TeamBStyles.scss';
import '@styles/board/TeamFlag';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';

const ScoreBoard: React.FC<Record<string, never>> = () => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  const teamAStyle = `team-a-${teamA.category}-${teamA.code}-${teamA.uniform}`;
  const teamBStyle = `team-b-${teamB.category}-${teamB.code}-${teamB.uniform}`;

  return (
    <div className='score-board-container'>
      <div className='score-board-wrapper'>
        <div className='team-a-flag-wrapper team-flag-wrapper'>
          <Flag team={teamA} className='team-a-flag'></Flag>
        </div>
        {/* 팀 A */}
        <div className={`team-section team-a-format ${teamAStyle}`}>
          <div className='team-text-wrapper'>
            <div className='team-text'>
              {/* {teamCodeToTeamName(teamA.category, teamA.code)} */}
              {teamA.name}
            </div>
          </div>
          <div className='team-score-wrapper'>
            <div className='score-text'>{teamA.score}</div>
          </div>
        </div>
        {/* 팀 B */}
        <div className={`team-section team-b-format ${teamBStyle}`}>
          <div className='team-score-wrapper'>
            <div className='score-text'>{teamB.score}</div>
          </div>
          <div className='team-text-wrapper'>
            <div className='team-text'>{teamB.name}</div>
          </div>
        </div>
        <div className='team-b-flag-wrapper team-flag-wrapper'>
          <Flag team={teamB} className='team-b-flag'></Flag>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
