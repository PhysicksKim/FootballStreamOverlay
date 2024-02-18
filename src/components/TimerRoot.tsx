import React, { useState, useEffect } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';

import CSSTransition from 'react-transition-group/CSSTransition';

import MainTimeBoard from './board/MainTimeBoard';
import ScoreBoard from './board/ScoreBoard';
import LiveControlTab from './control/LiveControlTab';
import InjuryTimeBoard from './board/InjuryTimeBoard';
import MatchNameBoard from './board/MatchNameBoard';
import TeamControlTab from './control/TeamControlTab';

import GlobalStyle from './styledcomponents/GlobalStyle';
import '@styles/TimerRoot.scss';
import '@styles/TimerRootTransition.scss';

import { useFont } from '@src/contexts/FontContext';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import RouteTabs from './RouteControlPanels';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import RemoteMessageManager from './manager/RemoteMessageManager';
import RemoteTab from './remote/RemoteTab';
import { useMatchName } from '@src/contexts/MatchNameContext';
import { useInjuryTimeInfo } from '@src/contexts/timers/injury/InjuryTimeInfoProvider';

const TimerRoot = () => {
  // 글로벌 폰트
  const { fontInfo, updateGlobalFont } = useFont();

  // 대회 종류
<<<<<<< HEAD
  const { matchName, updateMatchName } = useMatchName();
=======
  const [matchName, setMatchName] = useState(
    '2023-24 잉글랜드 프리미어리그 25R',
  );
>>>>>>> main

  // 타이머
  const mainTimerManager = useMainTimerManager();
  const injuryTimerManager = useInjuryTimerManager();

  // 추가시간 타이머
  const {
    givenInjuryTime,
    isShowInjuryTimer,
    updateGivenInjuryTime,
    showInjuryTimer,
    disappearInjuryTimer,
  } = useInjuryTimeInfo();

  // Team 속성
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  useEffect(() => {
    mainTimerManager.eventEmitter.on('halfTimeStop', () => {
      showInjuryTimer();
      injuryTimerManager.startTimer({ min: 0, sec: 0 });
    });
  }, []);

  return (
    <div className='timer-context-root'>
      <RemoteMessageManager
        givenInjuryTime={givenInjuryTime}
        isShowInjuryTimer={isShowInjuryTimer}
        updateGivenInjuryTime={updateGivenInjuryTime}
        showInjuryTimer={showInjuryTimer}
        disappearInjuryTimer={disappearInjuryTimer}
        matchName={matchName}
        updateMatchName={updateMatchName}
      />
      <GlobalStyle key='font-family-style-provide' fontFamily={fontInfo.code} />
      <div className='board-container-fixer'>
        <div className='board-container'>
          <MatchNameBoard matchName={matchName} />
          <ScoreBoard />
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
        {/* /#/ , /#/team-b 같은 식으로 hash(#) 를 사용해서 새로고침에도 대응되도록 함 */}
        <HashRouter>
          <RouteTabs></RouteTabs>
          <Routes>
            <Route
              path=''
              element={
                <LiveControlTab
                  key='livetab'
                  disappearInjuryTimer={disappearInjuryTimer}
                  showInjuryTimer={showInjuryTimer}
                  isShowInjuryTimer={isShowInjuryTimer}
                  updateGivenInjuryTime={updateGivenInjuryTime}
                  updateMatchName={updateMatchName}
                ></LiveControlTab>
              }
            ></Route>
            <Route
              path='team-a'
              element={
                <TeamControlTab
                  key='teamAtab'
                  team={teamA}
                  updateTeam={updateTeamA}
                />
              }
            ></Route>
            <Route
              path='team-b'
              element={
                <TeamControlTab
                  key='teamBtab'
                  team={teamB}
                  updateTeam={updateTeamB}
                />
              }
            ></Route>
            <Route
              path='remote'
              element={<RemoteTab key='remotetab' />}
            ></Route>
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default TimerRoot;
