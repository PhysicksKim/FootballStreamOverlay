import React from 'react';
import '../../styles/BoardControlPanel.scss';
import 'flag-icons/css/flag-icons.min.css';
import { Team } from '../TimerRoot';
import countries from '@src/classes/CountryCodes';

interface BoardControlPanelProps {
  teamA: Team;
  teamB: Team;
  setTeamA: React.Dispatch<React.SetStateAction<Team>>;
  setTeamB: React.Dispatch<React.SetStateAction<Team>>;
}

const BoardControlPanel: React.FC<BoardControlPanelProps> = ({
  teamA,
  teamB,
  setTeamA,
  setTeamB,
}) => {
  // Team A 골 조작
  const handleGoalChangeA = (change: number) => {
    setTeamA((prevTeam) => ({
      ...prevTeam,
      score: prevTeam.score + change >= 0 ? prevTeam.score + change : 0, // 골은 0 이하가 되지 않도록 조건 추가
    }));
  };

  // Team B 골 조작
  const handleGoalChangeB = (change: number) => {
    setTeamB((prevTeam) => ({
      ...prevTeam,
      score: prevTeam.score + change >= 0 ? prevTeam.score + change : 0,
    }));
  };

  // Team A 국가 코드 및 이름 변경
  const handleCountryChangeA = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    setTeamA((prevTeam) => ({
      ...prevTeam,
      code: event.target.value,
      name: selectedOption.text,
    }));
  };

  // Team B 국가 코드 및 이름 변경
  const handleCountryChangeB = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    setTeamB((prevTeam) => ({
      ...prevTeam,
      code: event.target.value,
      name: selectedOption.text,
    }));
  };

  // Team A 어웨이 상태 변경
  const handleAwayCheckA = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamA((prevTeam) => ({
      ...prevTeam,
      isAway: event.target.checked,
    }));
  };

  // Team B 어웨이 상태 변경
  const handleAwayCheckB = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamB((prevTeam) => ({
      ...prevTeam,
      isAway: event.target.checked,
    }));
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
          <select name='country-a' onChange={handleCountryChangeA}>
            {Object.entries(countries).map(([countryName, countryCode]) => (
              <option key={countryCode} value={countryCode}>
                {countryName}
              </option>
            ))}
          </select>
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
          <select name='country-b' onChange={handleCountryChangeB}>
            {Object.entries(countries).map(([countryName, countryCode]) => (
              <option key={countryCode} value={countryCode}>
                {countryName}
              </option>
            ))}
          </select>
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
