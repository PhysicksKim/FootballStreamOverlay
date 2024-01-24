import React, { useEffect } from 'react';
import '@styles/control/TeamControlPanel.scss';
import {
  Categories,
  categoryStringToTitle,
  categoryStringToTeamCodes,
  teamCodeToTeamName,
} from '@src/classes/team/Category';
import { Team } from '@src/types/types';

interface TeamControlPanelProps {
  team: Team;
  updateTeam: <K extends keyof Team>(key: K, value: Team[K]) => void;
}

const TeamControlPanel: React.FC<TeamControlPanelProps> = ({
  team,
  updateTeam,
}) => {
  const [category, setCategory] = React.useState<string>(Categories.Asiancup);
  const [teamCode, setTeamCode] = React.useState<string>('kr');
  const [teamName, setTeamName] = React.useState<string>('대한민국');
  const [uniformType, setUniformType] = React.useState<string>('home');
  const [isShowUniform, setIsShowUniform] = React.useState<boolean>(true);

  useEffect(() => {
    setIsShowUniform(false);
  }, [category]);

  useEffect(() => {
    updateTeam('category', category);
    updateTeam('code', teamCode);
    setIsShowUniform(true);
  }, [teamCode]);

  useEffect(() => {
    updateTeam('name', teamName);
  }, [teamName]);

  useEffect(() => {
    if (team.category === category) {
      updateTeam('uniform', uniformType);
    }
  }, [uniformType]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCategory(event.target.value);
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamCode = event.target.value;
    setTeamCode(teamCode);
    setTeamName(teamCodeToTeamName(category, teamCode));
  };

  return (
    <div className='team-control-container'>
      <div className='category-select-box'>
        <div className='select-box-title'>카테고리</div>
        <select
          id='category-select'
          size={2}
          value={category}
          onChange={(e) => handleCategoryChange(e)}
        >
          {Object.entries(Categories).map(([_, categoryString]) => (
            <option key={categoryString} value={categoryString}>
              {categoryStringToTitle(categoryString)}
            </option>
          ))}
        </select>
      </div>
      <div className='team-select-box'>
        <div className='select-box-title'>팀 이름</div>
        <select
          id='team-select'
          size={2}
          value={teamCode}
          onChange={(e) => handleTeamChange(e)}
        >
          {Object.entries(categoryStringToTeamCodes(category)).map(
            ([_, codeAndName]) => (
              <option key={codeAndName.code} value={codeAndName.code}>
                {codeAndName.name}
              </option>
            ),
          )}
        </select>
      </div>
      <div className='uniform-select-box'>
        <div className='select-box-title'>유니폼</div>
        <select
          id='uniform-select'
          size={2}
          value={uniformType}
          onChange={(e) => setUniformType(e.target.value)}
        >
          {isShowUniform ? (
            <>
              <option value='home'>홈</option>
              <option value='away'>어웨이</option>
              {category !== Categories.Asiancup && (
                <option value='third'>3rd</option>
              )}{' '}
            </>
          ) : (
            <option value='none' disabled>
              팀을 선택해 주세요
            </option>
          )}
        </select>
      </div>
    </div>
  );
};

export default TeamControlPanel;
