import React from 'react';
import { TimerPresets } from './TimerControlPanel';

export interface TimerPresetProps {
  presets: TimerPresets;
}

const TimerPresetButtons: React.FC<TimerPresetProps> = ({ presets }) => {
  const { wait, start, injury } = presets;

  return (
    <div className='gametime-preset-buttons'>
      <div className='wait-buttons'>
        <button onClick={wait.FirstHalf}>전반 대기</button>
        <button onClick={wait.SecondHalf}>후반 대기</button>
        <button onClick={wait.OverFirstHalf}>연전 대기</button>
        <button onClick={wait.OverSecondHalf}>연후 대기</button>
      </div>
      <div className='start-buttons'>
        <button onClick={start.FirstHalf}>전반 시작</button>
        <button onClick={start.SecondHalf}>후반 시작</button>
        <button onClick={start.OverFirstHalf}>연전 시작</button>
        <button onClick={start.OverSecondHalf}>연후 시작</button>
      </div>
      <div className='overtime-start-buttons'>
        <button onClick={injury.FirstHalf}>전반 추가</button>
        <button onClick={injury.SecondHalf}>후반 추가</button>
        <button onClick={injury.OverFirstHalf}>연전 추가</button>
        <button onClick={injury.OverSecondHalf}>연후 추가</button>
      </div>
    </div>
  );
};

export default TimerPresetButtons;
