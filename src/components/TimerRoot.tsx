import React, { useState, useEffect } from 'react';
import Timer from '../classes/Timer'; // SoccerTimer 클래스를 임포트합니다.
import TimeBoard from './TimeBoard';
import ScoreBoard from './ScoreBoard';
import ControlPanel from './ControlPanel';
import '../styles/TimerRoot.scss';

const TimerRoot = () => {
  const [timer, setTimer] = useState(new Timer());
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [timeDisplay, setTimeDisplay] = useState('00:00');

  useEffect(() => {
    timer.on('secondsUpdated', () => {
      const time = timer.getCurrentTime();
      const [mins, secs] = time.split(':');
      setTimeDisplay(`${zeroFill(mins)}:${zeroFill(secs)}`);
    });

    timer.on('timeExceeded', () => {
      console.log('타이머가 120분을 초과했습니다.');
      // 필요한 추가 동작 수행
    });

    timer.on('timeExceeded', () => {
      setMinutes('120');
      setSeconds('0');
      setTimeDisplay('120:00');
    });

    return () => {
      timer.stop();
    };
  }, [timer]);

  const startTimer = (min: number, sec: number) => {
    setMinutes(min.toString());
    setSeconds(sec.toString());
    setTimeDisplay(`${zeroFill(min.toString())}:${zeroFill(sec.toString())}`);
    timer.start(min, sec);
  };

  const zeroFill = (numberString: string) => {
    return numberString.padStart(2, '0');
  };

  const updateTime = (time: { min: number; sec: number }) => {
    startTimer(time.min, time.sec);
  };

  const restartTime = () => {
    timer.restart();
  };

  const stopTime = () => {
    timer.stop();
  };

  return (
    <div className='timer-context-root'>
      <div className='timer-container'>
        <ScoreBoard />
        <TimeBoard timeDisplay={timeDisplay}></TimeBoard>
      </div>
      <ControlPanel
        updateTime={updateTime}
        restartTime={restartTime}
        stopTime={stopTime}
      ></ControlPanel>
    </div>
  );
};

export default TimerRoot;
