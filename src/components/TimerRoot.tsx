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
import RouteControlPanels from './RouteControlPanels';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import RemoteReceiveTab from './remote/RemoteReceiveTab';
import RemoteControlTab from './remote/RemoteControlTab';
import RemoteMessageManager from './manager/RemoteMessageManager';

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
  const { teamA, updateTeamA } = useTeamA();
  const { teamB, updateTeamB } = useTeamB();

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

  return (
    <div className='timer-context-root'>
      <RemoteMessageManager
        givenInjuryTime={givenInjuryTime}
        matchName={matchName}
        disappearInjuryTimer={disappearInjuryTimer}
        showInjuryTimer={showInjuryTimer}
        isShowInjuryTimer={isShowInjuryTimer}
        updateGivenInjuryTime={updateGivenInjuryTime}
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
          <RouteControlPanels></RouteControlPanels>
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
            <Route path='remotereceive' element={<RemoteReceiveTab />}></Route>
            <Route path='remotecontrol' element={<RemoteControlTab />}></Route>
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default TimerRoot;
