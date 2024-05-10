import React from 'react';

import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import { teamCodeToTeamName } from '@src/classes/team/Category';
import { FONT_COLOR } from '@src/classes/FontEnum';

import '@styles/control/upperPanel/TeamNameBox.scss';

const TeamNameBox = () => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  const { teamAStyle, updateTeamAStyle } = useTeamAStyle();
  const { teamBStyle, updateTeamBStyle } = useTeamBStyle();

  const handleTeamANameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      handleResetTeamAName();
    } else {
      updateTeamA('name', e.target.value);
    }
  };
  const handleTeamBNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      handleResetTeamBName();
    } else {
      updateTeamB('name', e.target.value);
    }
  };

  const handleResetTeamAName = () => {
    const originalTeamA = teamCodeToTeamName(teamA.category, teamA.code);
    updateTeamA('name', originalTeamA);
  };
  const handleResetTeamBName = () => {
    const originalTeamB = teamCodeToTeamName(teamB.category, teamB.code);
    updateTeamB('name', originalTeamB);
  };

  const handleTeamAFontColorChange = (isChecked: boolean) => {
    updateTeamAStyle('fontColor', isChecked ? FONT_COLOR.BLACK : 'white');
  };
  const handleTeamBFontColorChange = (isChecked: boolean) => {
    updateTeamBStyle('fontColor', isChecked ? FONT_COLOR.BLACK : 'white');
  };

  return (
    <div className='team-name-change-box'>
      <div className='team-name-change-wrapper'>
        <div className='team-name-input-box team-a-name-box'>
          <input
            id='change-team-a-name-input'
            type='text'
            required={true}
            onChange={handleTeamANameChange}
          />
          <label htmlFor='change-team-a-name-input'>Team A 이름 변경</label>
        </div>
        <div className='font-is-black-wrapper'>
          <div>검은색 폰트</div>
          <input
            className='font-is-black-checkbox'
            type='checkbox'
            id='font-is-black-team-a'
            checked={teamAStyle.fontColor === FONT_COLOR.BLACK}
            onChange={(e) => handleTeamAFontColorChange(e.target.checked)}
          />
        </div>
      </div>
      <div className='team-name-change-wrapper'>
        <div className='team-name-input-box team-b-name-box'>
          <input
            id='change-team-b-name-input'
            type='text'
            required={true}
            onChange={handleTeamBNameChange}
          />
          <label htmlFor='change-team-b-name-input'>Team B 이름 변경</label>
        </div>
        <div className='font-is-black-wrapper'>
          <div>검은색 폰트</div>
          <input
            className='font-is-black-checkbox'
            type='checkbox'
            id='font-is-black-team-b'
            checked={teamBStyle.fontColor === FONT_COLOR.BLACK}
            onChange={(e) => handleTeamBFontColorChange(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TeamNameBox);
