import React from 'react';
import { defaultMatchName } from '@src/classes/team/DefaultScoreBoardValue';
import TeamNameBox from './TeamNameBox';

import '@styles/control/upperPanel/TimerTitleBox.scss';

export interface TimerTitleBoxProps {
  updateMatchName: (matchName: string) => void;
}

const TimerTitleBox: React.FC<TimerTitleBoxProps> = ({ updateMatchName }) => {
  return (
    <div className='timer-title-box'>
      <div className='match-title-input-box'>
        <div className='match-title-text-index index-text'>매치 타이틀</div>
        <input
          id='match-title-text-input'
          className='match-title-text-input'
          type='text'
          placeholder={defaultMatchName}
          onChange={(e) => {
            const title = e.target.value.trim();
            if (!title) {
              updateMatchName(defaultMatchName);
            } else {
              updateMatchName(e.target.value);
            }
          }}
        />
      </div>

      <TeamNameBox />
    </div>
  );
};

export default TimerTitleBox;
