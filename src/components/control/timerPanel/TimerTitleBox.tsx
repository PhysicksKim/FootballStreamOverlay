import { useFont } from '@src/contexts/FontContext';
import React from 'react';
import '@styles/control/TimerTitleBox.scss';
import { defaultMatchName } from '@src/classes/team/DefaultScoreBoardValue';

export interface TimerTitleBoxProps {
  updateMatchName: (matchName: string) => void;
  changeGivenInjuryTime: (value: string) => void;
}

const TimerTitleBox: React.FC<TimerTitleBoxProps> = ({
  updateMatchName,
  changeGivenInjuryTime,
}) => {
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
      <div className='given-injury-input-box'>
        <div className='given-injury-input-index index-text'>추가 시간</div>
        <input
          id='given-injury-time-input'
          className='given-injury-time-input'
          type='number'
          placeholder='추가시간'
          onChange={(e) => changeGivenInjuryTime(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TimerTitleBox;
