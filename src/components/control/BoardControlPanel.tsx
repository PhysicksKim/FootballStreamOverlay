import React, { ChangeEvent } from 'react';
import countries from '@src/classes/CountryCodes';

import '../../styles/control/BoardControlPanel.scss';
import 'flag-icons/css/flag-icons.min.css';

import { Team } from '@src/types/types';

interface BoardControlPanelProps {
  teamA: Team;
  teamB: Team;
  updateTeamA: <K extends keyof Team>(key: K, value: Team[K]) => void;
  updateTeamB: <K extends keyof Team>(key: K, value: Team[K]) => void;
}

const BoardControlPanel: React.FC<BoardControlPanelProps> = ({
  teamA,
  teamB,
  updateTeamA,
  updateTeamB,
}) => {
  // Team A 골 조작
  const handleGoalChangeA = (change: number) => {
    updateTeamA('score', teamA.score + change >= 0 ? teamA.score + change : 0); // 골은 0 이하가 되지 않도록 조건 추가
  };

  // Team B 골 조작
  const handleGoalChangeB = (change: number) => {
    updateTeamB('score', teamB.score + change >= 0 ? teamB.score + change : 0); // 골은 0 이하가 되지 않도록 조건 추가
  };

  // Team A 국가 코드 및 이름 변경
  const handleCountryChangeA = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedOptionValue = event.target.value;
    const selectedOptionText = event.target.nextSibling.textContent; // 라디오 버튼 옆에 있는 label의 텍스트를 가져옵니다.

    updateTeamA('code', selectedOptionValue);
    updateTeamA('name', selectedOptionText);
  };

  // Team B 국가 코드 및 이름 변경
  const handleCountryChangeB = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedOptionValue = event.target.value;
    const selectedOptionText = event.target.nextSibling.textContent; // 라디오 버튼 옆에 있는 label의 텍스트를 가져옵니다.

    updateTeamB('code', selectedOptionValue);
    updateTeamB('name', selectedOptionText);
  };

  // Team A 어웨이 상태 변경
  const handleAwayCheckA = (event: ChangeEvent<HTMLInputElement>) => {
    updateTeamA('isAway', event.target.checked);
  };

  // Team B 어웨이 상태 변경
  const handleAwayCheckB = (event: ChangeEvent<HTMLInputElement>) => {
    updateTeamB('isAway', event.target.checked);
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
          <div className='team-radio-button-group'>
            {/* TODO : epl 팀 나중에 추가해야 하니까 라디오 버튼으로 핸들링 하는거 구조와 기능 재사용성 검토 */}
            {Object.entries(countries).map(([countryName, countryCode]) => (
              <div key={`a-${countryCode}`}>
                <input
                  type='radio'
                  id={`a-${countryCode}`}
                  name='country-a'
                  value={countryCode}
                  onChange={handleCountryChangeA}
                  checked={teamA.code === countryCode} // teamA의 code와 비교
                />
                <label htmlFor={`a-${countryCode}`}>{countryName}</label>
              </div>
            ))}
          </div>
          <div className='away-check-group'>
            <label className='away-check-label' htmlFor='awaycheck-a'>
              어웨이
            </label>
            <input
              id={'awaycheck-a'}
              type='checkbox'
              checked={teamA.isAway}
              onChange={handleAwayCheckA}
            ></input>
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
          <div className='team-radio-button-group'>
            {Object.entries(countries).map(([countryName, countryCode]) => (
              <div key={`b-${countryCode}`}>
                <input
                  type='radio'
                  id={`b-${countryCode}`}
                  name='country-b'
                  value={countryCode}
                  onChange={handleCountryChangeB}
                  checked={teamB.code === countryCode} // teamB의 code와 비교
                />
                <label htmlFor={`b-${countryCode}`}>{countryName}</label>
              </div>
            ))}
          </div>
          <div className='away-check-group'>
            <label className='away-check-label' htmlFor='awaycheck-b'>
              어웨이
            </label>
            <input
              id={'awaycheck-b'}
              type='checkbox'
              checked={teamB.isAway}
              onChange={handleAwayCheckB}
            ></input>{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardControlPanel;
