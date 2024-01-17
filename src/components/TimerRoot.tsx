import React, { useState, useEffect, useRef } from 'react';
import Timer from '../classes/Timer'; // SoccerTimer 클래스를 임포트합니다.
import TimeBoard from './TimeBoard';
import ScoreBoard from './ScoreBoard';
import ControlPanel from './ControlPanel';
import '../styles/TimerRoot.scss';
import useTimerHook from '@src/hooks/useTimerHook';

const TimerRoot = () => {
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');
  const [timer, eventEmitter] = useTimerHook();

  useEffect(() => {
    setMainTimeDisplay(
      `${zeroFill(timer.time.min.toString())}:${zeroFill(
        timer.time.sec.toString(),
      )}`,
    );
  }, [timer.time]);

  const startTimer = (min: number, sec: number) => {
    timer.start(min, sec);
    setMainTimeDisplay(
      `${zeroFill(min.toString())}:${zeroFill(sec.toString())}`,
    );
  };

  const updateTime = (time: { min: number; sec: number }) => {
    startTimer(time.min, time.sec);
  };

  const resumeTimer = () => {
    timer.resume();
  };

  const pauseTimer = () => {
    timer.pause();
  };

  const zeroFill = (numberString: string) => {
    return numberString.padStart(2, '0');
  };

  return (
    <div className='timer-context-root'>
      <div className='timer-container'>
        <ScoreBoard />
        <TimeBoard timeDisplay={mainTimeDisplay}></TimeBoard>
      </div>
      <ControlPanel
        updateTime={updateTime}
        resumeTimer={resumeTimer}
        pauseTimer={pauseTimer}
      ></ControlPanel>
    </div>
  );
};

export default TimerRoot;
