import React from 'react';
import { Team } from '@src/types/types';
import { Flag } from '../styledcomponents/TeamFlag';
import '@styles/board/ScoreBoard.scss';
import '@styles/board/TeamAStyles.scss';
import '@styles/board/TeamBStyles.scss';
import '@styles/board/TeamFlag';

export interface ScoreBoardProps {
  teamA: Team;
  teamB: Team;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teamA, teamB }) => {
  const teamAStyle = `team-a-${teamA.code}${teamA.isAway ? '-away' : ''}`;
  const teamBStyle = `team-b-${teamB.code}${teamB.isAway ? '-away' : ''}`;

  return (
    <div className='score-board-container'>
      <div className='score-board-wrapper'>
        <div className='team-a-flag-wrapper team-flag-wrapper'>
          <Flag team={teamA} className='team-a-flag'></Flag>
        </div>
        {/* 팀 A */}
        <div className={`team-section team-a-format ${teamAStyle}`}>
          <div className='team-text-wrapper'>
            <div className='team-text'>{teamA.name}</div>
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
