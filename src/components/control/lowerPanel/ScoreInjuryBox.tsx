import React from 'react';

import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

import { updateGivenInjuryTime } from '@src/redux/slices/InjuryTimeInfoSlice';

import '@styles/control/lowerPanel/ScoreInjuryBox.scss';
import { useDispatch } from 'react-redux';

const ScoreInjuryBox: React.FC<Record<string, never>> = () => {
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  const [givenInjuryInput, setGivenInjuryInput] = React.useState('' as string);

  const { isRemoteConnected } = useRemoteClient();

  // Score Button Click
  const handleScoreChangeBtn = (operator: '+' | '-', team: 'A' | 'B') => {
    const change = operator === '+' ? 1 : -1;
    const prevScore = team === 'A' ? teamA.score : teamB.score;
    // 골은 0 이상이어야 합니다.
    const newScore = prevScore + change >= 0 ? prevScore + change : 0;

    if (team === 'A') {
      updateTeamA('score', newScore);
    } else {
      updateTeamB('score', newScore);
    }
  };

  const dispatch = useDispatch();

  // Given Injury Time Input Change
  const handleGivenInjuryTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const numbers = extractNumbers(e.target.value);
    setGivenInjuryInput(numbers);

    const parsedMin = parseInt(numbers);
    if (!parsedMin) {
      dispatch(updateGivenInjuryTime(0));
    } else {
      dispatch(updateGivenInjuryTime(parsedMin));
    }
  };

  /**
   * 문자열에서 숫자만 추출합니다
   * @param str 검사할 문자열
   * @returns 추출한 숫자 문자열을 반환합니다. 숫자가 없다면 '' 을 반환합니다.
   */
  const extractNumbers = (str: string) => {
    const numbers = str.match(/\d+/g) || [];
    return numbers.join('');
  };

  return (
    <div className='score-injury-contol-panel-box'>
      <div
        className={`score-injury-wrapper ${
          isRemoteConnected ? 'score-injury-wrapper-active' : ''
        }`}
      >
        <div className='score-control-wrapper'>
          <div className='score-title'>스코어</div>
          <div className='score-control'>
            <div className='team-a-wrapper'>
              <div className='score-team-text'>Team A</div>
              <div className='input-box'>
                <div className='input-box-btn-wrapper'>
                  <button
                    className='score-up-team-a'
                    onClick={(e) => handleScoreChangeBtn('+', 'A')}
                  >
                    <FontAwesomeIcon icon={faCaretUp} />
                  </button>
                  <button
                    className='score-down-team-a'
                    onClick={(e) => handleScoreChangeBtn('-', 'A')}
                  >
                    <FontAwesomeIcon icon={faCaretDown} />
                  </button>
                </div>
                <input
                  id='team-a-score-input'
                  type='number'
                  value={teamA.score}
                  onChange={() => {
                    return;
                  }}
                />
              </div>
            </div>
            <div className='team-b-wrapper'>
              <div className='score-team-text'>Team B</div>
              <div className='input-box'>
                <div className='input-box-btn-wrapper'>
                  <button
                    className='score-up-team-b'
                    onClick={(e) => handleScoreChangeBtn('+', 'B')}
                  >
                    <FontAwesomeIcon icon={faCaretUp} />
                  </button>
                  <button
                    className='score-up-team-b'
                    onClick={(e) => handleScoreChangeBtn('-', 'B')}
                  >
                    <FontAwesomeIcon icon={faCaretDown} />
                  </button>
                </div>
                <input
                  id='team-b-score-input'
                  type='number'
                  value={teamB.score}
                  onChange={() => {
                    return;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='injury-contorl-wrapper'>
          <div className='given-injury-title'>추가시간</div>
          <div className='given-injury-input-wrapper'>
            <input
              id='given-injury-input'
              type='text'
              className='given-injury-input'
              placeholder='0'
              value={givenInjuryInput}
              onChange={handleGivenInjuryTimeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreInjuryBox;
