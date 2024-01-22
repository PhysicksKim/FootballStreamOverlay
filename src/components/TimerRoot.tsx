import React, { useState, useEffect, useRef } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import useTimerHook, { TimerState } from '@src/hooks/useTimerHook';

import MainTimeBoard from './board/MainTimeBoard';
import ScoreBoard from './board/ScoreBoard';
import ControlPanel from './control/ControlPanel';
import InjuryTimeBoard from './board/InjuryTimeBoard';
import MatchNameBoard from './board/MatchNameBoard';

import '../styles/TimerRoot.scss';
import '../styles/TimerRootTransition.scss';

import { Time } from '@src/types/types';
import { timeToZeroFillString } from '@src/classes/Utils';
import GlobalStyle from './styledcomponents/GlobalStyle';
import { useFont } from '@src/contexts/FontContext';

export interface TimerManager {
  timer: TimerState;
  startTimer: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setTimer: (time: { min: number; sec: number }) => void;
}

export interface Team {
  category: string;
  code: string;
  name: string;
  score: number;
  isAway: boolean;
}

const TimerRoot = () => {
  // 글로벌 폰트
  const { fontInfo, updateGlobalFont } = useFont();

  // 대회 종류
  const [matchName, setMatchName] = useState('아시안컵 E조 조별 예선');

  // 메인시간 타이머
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');
  const [mainTimer, mainEventEmitter] = useTimerHook();

  // 추가시간 타이머
  const [injuryTimeDisplay, setInjuryTimeDisplay] = useState('00:00');
  const [injuryTimer, injuryEventEmitter] = useTimerHook();
  const [givenInjuryTime, setGivenInjuryTime] = useState(0);
  const [isShowInjuryTimer, setIsShowInjuryTimer] = useState(false);
  const [isShownGivenInjuryTime, setIsShownGivenInjuryTime] = useState(true);

  // Team 속성
  const [teamA, setTeamA] = useState<Team>({
    category: 'country',
    code: 'kr',
    name: '대한민국',
    score: 0,
    isAway: false,
  });
  const [teamB, setTeamB] = useState<Team>({
    category: 'country',
    code: 'bh',
    name: '바레인',
    score: 0,
    isAway: true,
  });

  useEffect(() => {
    setMainTimeDisplay(timeToZeroFillString(mainTimer.time));
  }, [mainTimer.time]);

  useEffect(() => {
    setInjuryTimeDisplay(timeToZeroFillString(injuryTimer.time));
  }, [injuryTimer.time]);

  useEffect(() => {
    mainEventEmitter.on('halfTimeStop', () => {
      setIsShowInjuryTimer(true);
      injuryTimer.start();
    });
  }, []);

  const zeroFill = (numberString: string) => {
    return numberString.padStart(2, '0');
  };

  const disappearInjuryTimer = () => {
    setIsShowInjuryTimer(false);
  };

  const showInjuryTimer = () => {
    setIsShowInjuryTimer(true);
  };

  const updateGivenInjuryTime = (min: number) => {
    setGivenInjuryTime(min);
  };

  const updateMatchName = (matchName: string) => {
    setMatchName(matchName);
  };

  const updateTeamA = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamA((prevTeam) => ({ ...prevTeam, [key]: value }));
  };

  const updateTeamB = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamB((prevTeam) => ({ ...prevTeam, [key]: value }));
  };

  const mainTimerWrapper: TimerManager = {
    timer: mainTimer,
    startTimer: (time: Time) => {
      mainTimer.start(time.min, time.sec);
      setMainTimeDisplay(timeToZeroFillString(time));
    },
    resumeTimer: mainTimer.resume,
    pauseTimer: mainTimer.pause,
    setTimer: (time: Time) => {
      mainTimer.set(time.min, time.sec);
      setMainTimeDisplay(timeToZeroFillString(time));
    },
  };

  const injuryTimerWrapper: TimerManager = {
    timer: injuryTimer,
    startTimer: (time: Time) => {
      injuryTimer.start(time.min, time.sec);
      setInjuryTimeDisplay(
        `${zeroFill(time.min.toString())}:${zeroFill(time.sec.toString())}`,
      );
    },
    resumeTimer: injuryTimer.resume,
    pauseTimer: injuryTimer.pause,
    setTimer: (time: Time) => {
      injuryTimer.set(time.min, time.sec);
      setMainTimeDisplay(timeToZeroFillString(time));
    },
  };

  return (
    <div className='timer-context-root'>
      <GlobalStyle fontFamily={fontInfo.code} />
      <div className='board-container-fixer'>
        <div className='board-container'>
          <MatchNameBoard matchName={matchName} />
          <ScoreBoard teamA={teamA} teamB={teamB} />
          <MainTimeBoard timeDisplay={mainTimeDisplay}></MainTimeBoard>
          <CSSTransition
            in={isShowInjuryTimer}
            timeout={1000}
            classNames='injury-time'
            unmountOnExit
          >
            <InjuryTimeBoard
              timeDisplay={injuryTimeDisplay}
              givenInjuryTime={givenInjuryTime}
              isShownGivenInjuryTime={isShownGivenInjuryTime}
            ></InjuryTimeBoard>
          </CSSTransition>
        </div>
      </div>
      <div className='control-container-fixer'>
        <ControlPanel
          mainTimerWrapper={mainTimerWrapper}
          injuryTimerWrapper={injuryTimerWrapper}
          disappearInjuryTimer={disappearInjuryTimer}
          showInjuryTimer={showInjuryTimer}
          isShowInjuryTimer={isShowInjuryTimer}
          updateGivenInjuryTime={updateGivenInjuryTime}
          updateMatchName={updateMatchName}
          teamA={teamA}
          teamB={teamB}
          updateTeamA={updateTeamA}
          updateTeamB={updateTeamB}
        ></ControlPanel>
      </div>
    </div>
  );
};

export default TimerRoot;
