import React, { useState, useEffect, useRef } from 'react';
import MainTimeBoard from './MainTimeBoard';
import ScoreBoard from './ScoreBoard';
import ControlPanel from './control/ControlPanel';
import '../styles/TimerRoot.scss';
import '../styles/TimerRootTransition.scss';
import useTimerHook, { TimerState } from '@src/hooks/useTimerHook';
import InjuryTimeBoard from './InjuryTimeBoard';
import CSSTransition from 'react-transition-group/CSSTransition';
import { Time } from '@src/types/types';
import { timeToZeroFillString } from '@src/classes/Utils';

export interface TimerWrapper {
  timer: TimerState;
  startTimer: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setTimer: (time: { min: number; sec: number }) => void;
}

const TimerRoot = () => {
  // 메인시간 타이머
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');
  const [mainTimer, mainEventEmitter] = useTimerHook();
  // 추가시간 타이머
  const [injuryTimeDisplay, setInjuryTimeDisplay] = useState('00:00');
  const [injuryTimer, injuryEventEmitter] = useTimerHook();
  const [givenInjuryTime, setGivenInjuryTime] = useState(0);
  const [isInjuryTime, setIsInjuryTime] = useState(false);
  const [isShownGivenInjuryTime, setIsShownGivenInjuryTime] = useState(true);

  useEffect(() => {
    setMainTimeDisplay(timeToZeroFillString(mainTimer.time));
  }, [mainTimer.time]);

  useEffect(() => {
    setInjuryTimeDisplay(timeToZeroFillString(injuryTimer.time));
  }, [injuryTimer.time]);

  useEffect(() => {
    mainEventEmitter.on('halfTimeStop', () => {
      setIsInjuryTime(true);
      injuryTimer.start();
    });
  }, []);

  const zeroFill = (numberString: string) => {
    return numberString.padStart(2, '0');
  };

  const startMainTimer = (time: Time) => {
    mainTimer.start(time.min, time.sec);
    setMainTimeDisplay(timeToZeroFillString(time));
  };

  const setMainTimer = (time: Time) => {
    mainTimer.set(time.min, time.sec);
    setMainTimeDisplay(timeToZeroFillString(time));
  };

  const startInjuryTimer = (time: Time) => {
    injuryTimer.start(time.min, time.sec);
    setInjuryTimeDisplay(
      `${zeroFill(time.min.toString())}:${zeroFill(time.sec.toString())}`,
    );
  };
  const setInjuryTimer = (time: Time) => {
    injuryTimer.set(time.min, time.sec);
    setMainTimeDisplay(timeToZeroFillString(time));
  };

  const disappearInjuryTimer = () => {
    setIsInjuryTime(false);
  };

  const showInjuryTimer = () => {
    setIsInjuryTime(true);
  };

  const mainTimerWrapper: TimerWrapper = {
    timer: mainTimer,
    startTimer: startMainTimer,
    resumeTimer: mainTimer.resume,
    pauseTimer: mainTimer.pause,
    setTimer: setMainTimer,
  };

  const injuryTimerWrapper: TimerWrapper = {
    timer: injuryTimer,
    startTimer: startInjuryTimer,
    resumeTimer: injuryTimer.resume,
    pauseTimer: injuryTimer.pause,
    setTimer: setInjuryTimer,
  };

  return (
    <div className='timer-context-root'>
      <div className='board-container'>
        <ScoreBoard />

        <MainTimeBoard timeDisplay={mainTimeDisplay}></MainTimeBoard>
        <CSSTransition
          in={isInjuryTime}
          timeout={1000}
          classNames='injury-time'
          unmountOnExit
          onExited={() => {
            console.log('onExited : ', injuryTimeDisplay);
          }}
          onExiting={() => {
            console.log('onExiting : ', injuryTimeDisplay);
          }}
        >
          <InjuryTimeBoard
            timeDisplay={injuryTimeDisplay}
            // givenInjuryTime={givenInjuryTime}
            givenInjuryTime={6}
            isShownGivenInjuryTime={isShownGivenInjuryTime}
          ></InjuryTimeBoard>
        </CSSTransition>
      </div>
      <ControlPanel
        mainTimerWrapper={mainTimerWrapper}
        injuryTimerWrapper={injuryTimerWrapper}
        disappearInjuryTimer={disappearInjuryTimer}
        showInjuryTimer={showInjuryTimer}
      ></ControlPanel>
      <button
        onClick={() =>
          setIsInjuryTime((prev) => {
            // injuryTimer.start(); // 얘가 문제였구나!!
            return !prev;
          })
        }
      >
        인저리타이머토글
      </button>
      <button
        onClick={() => {
          setIsShownGivenInjuryTime((prev) => !prev);
        }}
      >
        추가시간표시
      </button>
    </div>
  );
};

export default TimerRoot;
