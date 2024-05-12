import React, { useEffect, useState } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';

import CSSTransition from 'react-transition-group/CSSTransition';

import MainTimeBoard from './board/MainTimeBoard';
import ScoreBoard from './board/ScoreBoard';
import InjuryTimeBoard from './board/InjuryTimeBoard';
import MatchNameBoard from './board/MatchNameBoard';

import LiveControlTab from './control/LiveControlTab';
import RouteTabs from './RouteControlPanels';
import RemoteTab from './remote/RemoteTab';
import TeamControlTab from './control/TeamControlTab';

import GlobalStyle from './styledcomponents/GlobalStyle';
import '@styles/TimerRoot.scss';
import '@styles/TimerRootTransition.scss';

import RemoteMessageManager from './manager/RemoteMessageManager';

import { useFont } from '@src/contexts/FontContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useMatchName } from '@src/contexts/MatchNameContext';
import { useInjuryTimeInfo } from '@src/contexts/timers/injury/InjuryTimeInfoProvider';
import TimerStop from './TimerStop';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux/Store';

const TimerRoot = () => {
  // 글로벌 폰트
  // const { fontInfo } = useFont();
  const fontInfo = useSelector((state: RootState) => state.font);
  // const dispatch = useDispatch<AppDispatch>();

  // 대회 종류
  const { matchName, updateMatchName } = useMatchName();

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

  return (
    <div className='timer-context-root'>
      <TimerStop />
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
