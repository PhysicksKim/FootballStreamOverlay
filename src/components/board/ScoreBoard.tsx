import React, { useEffect, useState } from 'react';
import { Flag } from '@src/components/styledcomponents/TeamFlag';

import '@styles/board/ScoreBoard.scss';
import '@styles/board/TeamAStyles.scss';
import '@styles/board/TeamBStyles.scss';
import '@styles/board/TeamFlag';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import isNeedToBlackFontColor from '@src/classes/team/TeamFontColorNeedToChange';

const calculateSpace = (name: string) => {
  const singleSpaceChars = /^[a-zA-Z0-9 !^*()[\]{}.,/|]$/;
  let space = 0;

  for (const char of name) {
    space += singleSpaceChars.test(char) ? 1 + 1 / 6 : 2;
  }

  return space;
};

const spaceToFontSize = (space: number) => {
  if (space <= 11.16) return '46px';
  if (space <= 13.16) return '38px';
  if (space <= 15.33) return '33px';
  if (space <= 17.33) return '28px';
  if (space <= 19.49) return '25px';
  return '24px';
};

const getFontSize = (name: string) => {
  const space = calculateSpace(name);
  return spaceToFontSize(space);
};

const ScoreBoard: React.FC<Record<string, never>> = () => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();
  const { teamAStyle, updateTeamAStyle } = useTeamAStyle();
  const { teamBStyle, updateTeamBStyle } = useTeamBStyle();
  const [teamAFontSize, setTeamAFontSize] = useState(getFontSize(teamA.name));
  const [teamBFontSize, setTeamBFontSize] = useState(getFontSize(teamB.name));

  const teamAStyleClassName = `team-a-${teamA.category}-${teamA.code}-${teamA.uniform}`;
  const teamBStyleClassName = `team-b-${teamB.category}-${teamB.code}-${teamB.uniform}`;

  useEffect(() => {
    const teamAFontSize = getFontSize(teamA.name);
    const teamBFontSize = getFontSize(teamB.name);
    setTeamAFontSize(teamAFontSize);
    setTeamBFontSize(teamBFontSize);
  }, [teamA, teamB]);

  useEffect(() => {
    if (isNeedToBlackFontColor(teamA)) {
      updateTeamAStyle('fontColor', 'black');
    } else {
      updateTeamAStyle('fontColor', 'white');
    }
    if (isNeedToBlackFontColor(teamB)) {
      updateTeamBStyle('fontColor', 'black');
    } else {
      updateTeamBStyle('fontColor', 'white');
    }
  }, [teamA.code, teamA.uniform, teamB.code, teamB.uniform]);

  return (
    <div className='score-board-container'>
      <div className='score-board-wrapper'>
        <div className='team-a-flag-wrapper team-flag-wrapper'>
          <Flag team={teamA} className='team-a-flag'></Flag>
        </div>
        {/* 팀 A */}
        <div className={`team-section team-a-format ${teamAStyleClassName}`}>
          <div className='team-text-wrapper team-a-text-wrapper'>
            <div
              className='team-text text-outstroke'
              data-text={teamA.name}
              style={{ fontSize: teamAFontSize, color: teamAStyle.fontColor }} // 폰트 크기 조정
            >
              {teamA.name}
            </div>
          </div>
          <div className='team-score-wrapper team-a-score-wrapper'>
            <div
              className='score-text score-text-a text-outstroke'
              data-text={teamA.score}
              style={{ color: teamAStyle.fontColor }}
            >
              {teamA.score}
            </div>
          </div>
        </div>
        {/* 팀 B */}
        <div className={`team-section team-b-format ${teamBStyleClassName}`}>
          <div className='team-score-wrapper team-b-score-wrapper'>
            <div
              className='score-text score-text-b text-outstroke'
              data-text={teamB.score}
              style={{ color: teamBStyle.fontColor }}
            >
              {teamB.score}
            </div>
          </div>
          <div className='team-text-wrapper team-b-text-wrapper'>
            <div
              className='team-text text-outstroke'
              data-text={teamB.name}
              style={{ fontSize: teamBFontSize, color: teamBStyle.fontColor }} // 폰트 크기 조정
            >
              {teamB.name}
            </div>
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
