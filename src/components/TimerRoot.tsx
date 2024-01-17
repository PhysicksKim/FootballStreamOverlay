import React, { useState, useEffect, useRef } from 'react';
import Timer from '../classes/Timer'; // SoccerTimer 클래스를 임포트합니다.
import TimeBoard from './TimeBoard';
import ScoreBoard from './ScoreBoard';
import ControlPanel from './ControlPanel';
import '../styles/TimerRoot.scss';
import useTimerHook from '@src/hooks/useTimerHook';

const TimerRoot = () => {
  const [mainTimer, setMainTimer] = useState(new Timer());
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const {
    start,
    stop,
    resume,
    pause,
    getCurrentTime,
    eventEmitter,
    totalSeconds,
  } = useTimerHook();

  const totalSecondsRef = useRef(totalSeconds);

  useEffect(() => {
    totalSecondsRef.current = totalSeconds;
  }, [totalSeconds]);

  useEffect(() => {
    eventEmitter.on('secondsUpdated', () => {
      const time = getCurrentTime(totalSecondsRef.current);
      const [mins, secs] = time.split(':');
      setMainTimeDisplay(`${zeroFill(mins)}:${zeroFill(secs)}`);

      console.log('event time :', time);
    });

    eventEmitter.on('timeExceeded', () => {
      setMinutes('120');
      setSeconds('0');
      setMainTimeDisplay('120:00');

      console.log('새 타이머 120분 초과');
    });

    return () => {
      eventEmitter.removeAllListeners();
      stop();
    };
  }, []);

  const startTimer = (min: number, sec: number) => {
    console.log('startTimer() called!!');
    setMinutes(min.toString());
    setSeconds(sec.toString());
    setMainTimeDisplay(
      `${zeroFill(min.toString())}:${zeroFill(sec.toString())}`,
    );
    start(min, sec);
  };

  const updateTime = (time: { min: number; sec: number }) => {
    startTimer(time.min, time.sec);
  };

  const resumeTimer = () => {
    resume();
  };

  const pauseTimer = () => {
    pause();
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
