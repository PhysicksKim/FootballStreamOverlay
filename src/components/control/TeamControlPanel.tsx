import React, { useEffect } from 'react';
import '@styles/control/TeamControlPanel.scss';
import {
  Categories,
  categoryStringToTitle,
  categoryStringToTeamCodes,
  teamCodeToTeamName,
  isValidCategoryAndTeamCode,
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
  const [category, setCategory] = React.useState<string>(team.category);
  const [teamCode, setTeamCode] = React.useState<string>(team.code);
  const [teamName, setTeamName] = React.useState<string>(team.name);
  const [uniformType, setUniformType] = React.useState<string>(team.uniform);
  const [isShowUniform, setIsShowUniform] = React.useState<boolean>(true);

  useEffect(() => {
    setIsShowUniform(false);
  }, [category]);

  useEffect(() => {
    // 카테고리와 팀코드가 유효한 경우에만 team 객체를 업데이트한다.
    if (isValidCategoryAndTeamCode(category, teamCode)) {
      updateTeam('category', category);
      updateTeam('code', teamCode);
      setIsShowUniform(true);
    }
  }, [teamCode]);

  useEffect(() => {
    if (isValidCategoryAndTeamCode(category, teamCode)) {
      updateTeam('name', teamName);
    }
  }, [teamName]);

  useEffect(() => {
    if (uniformType && team.category === category) {
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
              {/* {category !== Categories.Asiancup && ( */}
              <option value='third'>3rd</option>
              {/* )}{' '} */}
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
