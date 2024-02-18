import { FontEnum, fontInfos } from '@src/classes/FontEnum';
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
  const { fontInfo, updateGlobalFont } = useFont();
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
      <div className='font-radio-button-box'>
        {Object.entries(fontInfos).map(([fontCode, { name }]) =>
          fontCode === FontEnum.TAEBEAK ? ( // 태백체 비활성화
            <></>
          ) : (
            <div key={fontCode}>
              <input
                type='radio'
                id={`font-${fontCode}`}
                name='font-choice'
                value={fontCode}
                onChange={() => updateGlobalFont(fontCode as FontEnum)}
                checked={fontInfo.code === fontCode}
                disabled={fontCode === FontEnum.TAEBEAK}
              />
              <label htmlFor={`font-${fontCode}`}>{name}</label>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default TimerTitleBox;
