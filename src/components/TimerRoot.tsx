import React, { useState, useEffect } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import MainTimeBoard from './board/MainTimeBoard';
import ScoreBoard from './board/ScoreBoard';
import ControlPanel from './control/ControlPanel';
import InjuryTimeBoard from './board/InjuryTimeBoard';
import MatchNameBoard from './board/MatchNameBoard';

import '@styles/TimerRoot.scss';
import '@styles/TimerRootTransition.scss';

import { Team } from '@src/types/types';
import GlobalStyle from './styledcomponents/GlobalStyle';
import { useFont } from '@src/contexts/FontContext';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';

const TimerRoot = () => {
  // 글로벌 폰트
  const { fontInfo, updateGlobalFont } = useFont();

  // 대회 종류
  const [matchName, setMatchName] = useState('아시안컵 E조 조별 예선');

  // 타이머
  const mainTimerManager = useMainTimerManager();
  const injuryTimerManager = useInjuryTimerManager();

  // 추가시간 타이머
  const [givenInjuryTime, setGivenInjuryTime] = useState(0);
  const [isShowInjuryTimer, setIsShowInjuryTimer] = useState(false);

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
    mainTimerManager.eventEmitter.on('halfTimeStop', () => {
      setIsShowInjuryTimer(true);
      injuryTimerManager.startTimer({ min: 0, sec: 0 });
    });
  }, []);

  // #region injury timer board methods
  const disappearInjuryTimer = () => {
    setIsShowInjuryTimer(false);
  };

  const showInjuryTimer = () => {
    setIsShowInjuryTimer(true);
  };

  const updateGivenInjuryTime = (min: number) => {
    setGivenInjuryTime(min);
  };
  // #endregion

  const updateMatchName = (matchName: string) => {
    setMatchName(matchName);
  };

  const updateTeamA = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamA((prevTeam) => ({ ...prevTeam, [key]: value }));
  };

  const updateTeamB = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamB((prevTeam) => ({ ...prevTeam, [key]: value }));
  };

  return (
    <div className='timer-context-root'>
      <GlobalStyle fontFamily={fontInfo.code} />
      <div className='board-container-fixer'>
        <div className='board-container'>
          <MatchNameBoard matchName={matchName} />
          <ScoreBoard teamA={teamA} teamB={teamB} />
          <MainTimeBoard />
          <CSSTransition
            in={isShowInjuryTimer}
            timeout={1000}
            classNames='injury-time'
            unmountOnExit
          >
            <InjuryTimeBoard
              givenInjuryTime={givenInjuryTime}
            ></InjuryTimeBoard>
          </CSSTransition>
        </div>
      </div>
      <div className='control-container-fixer'>
        <ControlPanel
          disappearInjuryTimer={disappearInjuryTimer}
          showInjuryTimer={showInjuryTimer}
          isShowInjuryTimer={isShowInjuryTimer}
          updateGivenInjuryTime={updateGivenInjuryTime}
          updateMatchName={updateMatchName}
          // -------------
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
