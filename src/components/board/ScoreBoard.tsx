import React from 'react';
import { parseFlagClassName } from '@src/classes/Utils';

import 'flag-icons/css/flag-icons.min.css';
import '../../styles/board/ScoreBoard.scss';
import '../../styles/board/TeamAStyles.scss';
import '../../styles/board/TeamBStyles.scss';

import { Team } from '../TimerRoot';

export interface ScoreBoardProps {
  teamA: Team;
  teamB: Team;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teamA, teamB }) => {
  const teamAStyle = `team-a-${teamA.code}${teamA.isAway ? '-away' : ''}`;
  const teamBStyle = `team-b-${teamB.code}${teamB.isAway ? '-away' : ''}`;

  return (
    // TODO : 국기 표시 라이브러리 사용중인데, 따로 SVG 사용하는 식으로 해결할 필요 있어보임.
    // 왜냐하면 EPL 팀 로고 도입하려면 통일성있게 그냥 SVG 사용 방식으로 통일하는 게 맞아보임
    // 지금은 span 태그에 classname 만 추가해주면 되는데, 편하지만 확장성이 아쉬운듯함
    <div className='score-board-container'>
      <div className='score-board-wrapper'>
        <div className='team-a-flag-wrapper team-flag-wrapper'>
          <span className={`${parseFlagClassName(teamA.code, true)}`}></span>
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
          <span className={`${parseFlagClassName(teamB.code, true)}`}></span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
