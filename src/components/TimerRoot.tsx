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
import { webworker } from 'webpack';

const TimerRoot = () => {
  // 글로벌 폰트
  const { fontInfo } = useFont();

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

  // // WebWorker
  // const [webWorkerTime, setWebWorkerTime] = useState(0);

  // useEffect(() => {
  //   // 워커 생성
  //   const worker = new Worker(
  //     new URL('../hooks/TimerWebWorker.js', import.meta.url),
  //   );

  //   // 워커 메시지 수신 리스너 설정
  //   worker.onmessage = (e) => {
  //     console.log('Received message from worker:', e.data);
  //     if (e.data === 'tick') {
  //       // 워커로부터 'tick' 메시지를 받으면 시간을 업데이트합니다.
  //       setWebWorkerTime((prev) => prev + 1);
  //     }
  //   };

  //   // 워커에 'start' 메시지 보내기
  //   worker.postMessage('start');

  //   // 컴포넌트 언마운트 시 워커 종료
  //   return () => {
  //     worker.postMessage('stop');
  //     worker.terminate();
  //   };
  // }, []);

  return (
    <div className='timer-context-root'>
      {/* <div className='webworker-test-container'>
        <h1 style={{ color: 'white' }}>WebWorker Test Container</h1>
        <div
          className='webworker-time'
          style={{ color: 'white', marginLeft: '10px', fontSize: '30px' }}
        >
          {webWorkerTime}
        </div>
      </div> */}
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
