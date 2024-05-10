import React from 'react';
import { TimerPresets } from './TimerControlPanel';

export interface TimerPresetProps {
  presets: TimerPresets;
}

const TimerPresetButtons: React.FC<TimerPresetProps> = ({ presets }) => {
  const { wait, start, injury } = presets;

  return (
    <div className='gametime-preset-buttons'>
      <div className='timer-preset-index'>타이머 프리셋</div>
      <div className='preset-flex-box'>
        <div className='preset-first'>
          <div className='preset-title firsthalf-title'>전반</div>
          <button className='preset-btn' onClick={wait.FirstHalf}>
            대기
          </button>
          <button className='preset-btn' onClick={start.FirstHalf}>
            시작
          </button>
          <button className='preset-btn' onClick={injury.FirstHalf}>
            추가
          </button>
        </div>
        <div className='preset-second'>
          <div className='preset-title secondhalf-title'>후반</div>
          <button className='preset-btn' onClick={wait.SecondHalf}>
            대기
          </button>
          <button className='preset-btn' onClick={start.SecondHalf}>
            시작
          </button>
          <button className='preset-btn' onClick={injury.SecondHalf}>
            추가
          </button>
        </div>
        <div className='preset-overfirst'>
          <div className='preset-title overfirsthalf-title'>연전</div>
          <button className='preset-btn' onClick={wait.OverFirstHalf}>
            대기
          </button>
          <button className='preset-btn' onClick={start.OverFirstHalf}>
            시작
          </button>
          <button className='preset-btn' onClick={injury.OverFirstHalf}>
            추가
          </button>
        </div>
        <div className='preset-oversecond'>
          <div className='preset-title oversecondhalf-title'>연후</div>
          <button className='preset-btn' onClick={wait.OverSecondHalf}>
            대기
          </button>
          <button className='preset-btn' onClick={start.OverSecondHalf}>
            시작
          </button>
          <button className='preset-btn' onClick={injury.OverSecondHalf}>
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TimerPresetButtons);
