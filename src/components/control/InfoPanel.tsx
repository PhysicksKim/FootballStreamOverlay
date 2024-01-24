import React from 'react';

import '@styles/control/InfoPanel.scss';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { teamCodeToTeamName } from '@src/classes/team/Category';

const InfoPanel: React.FC<Record<string, never>> = () => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  const handleTeamANameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    updateTeamA('name', e.target.value);
  };
  const handleTeamBNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTeamB('name', e.target.value);
  };

  const handleResetTeamAName = () => {
    const originalTeamA = teamCodeToTeamName(teamA.category, teamA.code);
    updateTeamA('name', originalTeamA);
  };
  const handleResetTeamBName = () => {
    const originalTeamB = teamCodeToTeamName(teamB.category, teamB.code);
    updateTeamB('name', originalTeamB);
  };

  return (
    <div className='info-panel-wrapper'>
      <div className='team-a-name-change-box'>
        <div className='team-name-change-input-box'>
          <label htmlFor='team-a-name-input'>Team A 이름 변경</label>
          <input
            type='text'
            id='team-a-name-input'
            placeholder='권장 한글 5자 영어 10자'
            onChange={(e) => handleTeamANameChange(e)}
          />
        </div>
        <div className='team-name-change-button-box'>
          <button
            className='team-name-change-reset'
            onClick={handleResetTeamAName}
          >
            리셋
          </button>
        </div>
      </div>
      <div className='team-b-name-change-box'>
        <div className='team-name-change-input-box'>
          <label htmlFor='team-b-name-input'>Team B 이름 변경</label>
          <input
            type='text'
            id='team-b-name-input'
            placeholder='권장 한글 5자 영어 10자'
            onChange={(e) => handleTeamBNameChange(e)}
          />
        </div>
        <div className='team-name-change-button-box'>
          <button
            className='team-name-change-reset'
            onClick={handleResetTeamBName}
          >
            리셋
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
