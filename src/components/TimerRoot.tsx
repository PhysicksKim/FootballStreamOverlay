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

import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useMatchName } from '@src/contexts/MatchNameContext';
import TimerStop from './TimerStop';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/redux/Store';
import {
  InjuryTimeInfoState,
  updateGivenInjuryTime,
  showInjuryTimer,
  disappearInjuryTimer,
} from '@src/redux/slices/InjuryTimeInfoSlice';

const TimerRoot = () => {
  // 글로벌 폰트
  const fontInfo = useSelector((state: RootState) => state.font);
  const dispatch = useDispatch();

  // 대회 종류
  const { matchName, updateMatchName } = useMatchName();

  // 추가시간 타이머
  const injuryTimeInfo: InjuryTimeInfoState = useSelector(
    (state: RootState) => state.injuryTimeInfo,
  );

  // Team 속성
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

  return (
    <div className='timer-context-root'>
      <TimerStop />
      <RemoteMessageManager
        // givenInjuryTime={injuryTimeInfo.givenInjuryTime}
        // isShowInjuryTimer={injuryTimeInfo.isShowInjuryTimer}
        // updateGivenInjuryTime={() => dispatch(updateGivenInjuryTime())}
        // showInjuryTimer={() => dispatch(showInjuryTimer())}
        // disappearInjuryTimer={() => dispatch(disappearInjuryTimer())}
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
            in={injuryTimeInfo.isShowInjuryTimer}
            timeout={1000}
            classNames='injury-time'
            unmountOnExit
          >
            <InjuryTimeBoard
              givenInjuryTime={injuryTimeInfo.givenInjuryTime}
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
                  updateGivenInjuryTime={() =>
                    dispatch(updateGivenInjuryTime())
                  }
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
