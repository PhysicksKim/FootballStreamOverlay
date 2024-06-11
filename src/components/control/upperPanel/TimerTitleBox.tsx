import React, { useEffect, useRef } from 'react';
import {
  defaultMatchName,
  defaultMatchNameTemplate,
} from '@src/classes/team/DefaultScoreBoardValue';
import TeamNameBox from './TeamNameBox';

import '@styles/control/upperPanel/TimerTitleBox.scss';

export interface TimerTitleBoxProps {
  updateMatchName: (matchName: string) => void;
}

const TimerTitleBox: React.FC<TimerTitleBoxProps> = ({ updateMatchName }) => {
  const matchTitleTestInputRef = useRef(null);

  const handleEPLPreset = () => {
    handleMatchName(defaultMatchNameTemplate.EPL);
  };

  const handleEuroPrest = () => {
    handleMatchName(defaultMatchNameTemplate.EURO);
  };

  const handleFAPreset = () => {
    handleMatchName(defaultMatchNameTemplate.FA);
  };

  const handleMatchName = (matchName: string) => {
    updateMatchName(matchName);
    matchTitleTestInputRef.current.value = matchName;
  };

  return (
    <div className='timer-title-box'>
      <div className='match-title-input-box'>
        <div className='match-title-text-index index-text'>매치 타이틀</div>
        <div className='match-title-input-box'>
          <input
            id='match-title-text-input'
            className='match-title-text-input'
            type='text'
            ref={matchTitleTestInputRef}
            defaultValue={defaultMatchName}
            placeholder={defaultMatchName}
            onChange={(e) => {
              const title = e.target.value.trim();
              if (!title) {
                updateMatchName('');
              } else {
                handleMatchName(e.target.value);
              }
            }}
          />
          <input
            id='match-title-epl-preset-button'
            type='button'
            value='EPL'
            className='match-title-preset-button epl-preset'
            onClick={handleEPLPreset}
          />
          <input
            id='match-title-uefa-preset-button'
            type='button'
            value='Euro'
            className='match-title-preset-button uefa-preset'
            onClick={handleEuroPrest}
          />
          {/* <input
            id='match-title-uefa-preset-button'
            type='button'
            value='FA'
            className='match-title-preset-button uefa-preset'
            onClick={handleFAPreset}
          /> */}
        </div>
      </div>

      <TeamNameBox />
    </div>
  );
};

export default React.memo(TimerTitleBox);
