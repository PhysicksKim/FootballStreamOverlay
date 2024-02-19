import { useRemoteClient } from '@src/contexts/stomp/RemoteClientContext';
import { useTeamA } from '@src/contexts/teams/TeamAProvider';
import { useTeamAStyle } from '@src/contexts/teams/TeamAStyleProvider';
import { useTeamB } from '@src/contexts/teams/TeamBProvider';
import { useTeamBStyle } from '@src/contexts/teams/TeamBStyleProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { RemoteControlMsg } from '@src/types/stompTypes';
import { Time } from '@src/types/types';
import { time } from 'console';
import React, { useEffect } from 'react';

export interface RemoteReceiverProps {
  disappearInjuryTimer: () => void;
  showInjuryTimer: () => void;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

export type GetSyncedTimeType = (
  timerTime: Time,
  mil: number,
  deltaTime: number,
) => { min: number; sec: number; mil: number };

const RemoteReceiver: React.FC<RemoteReceiverProps> = ({
  disappearInjuryTimer,
  showInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  const {
    timer: mainTimer,
    startTimer: startMainTimer,
    pauseTimer: pauseMainTimer,
    resumeTimer: resumeMainTimer,
    setTimer: setMainTimer,
  } = useMainTimerManager();
  const {
    timer: injuryTimer,
    startTimer: startInjuryTimer,
    pauseTimer: pauseInjuryTimer,
    resumeTimer: resumeInjuryTimer,
    setTimer: setInjuryTimer,
  } = useInjuryTimerManager();
  // const {
  //   givenInjuryTime,
  //   isShowInjuryTimer,
  //   updateGivenInjuryTime,
  //   showInjuryTimer,
  //   disappearInjuryTimer,
  // } = useInjuryTimeInfo();
  const { updateTeamA } = useTeamA();
  const { updateTeamB } = useTeamB();
  const { updateTeamAStyle } = useTeamAStyle();
  const { updateTeamBStyle } = useTeamBStyle();

  const { remoteConrolMsg } = useRemoteClient();

  useEffect(() => {
    console.log('new Remote Messsage Received: ', remoteConrolMsg);
    updateStateByRemoteMsg(remoteConrolMsg);
  }, [remoteConrolMsg]);

  const updateStateByRemoteMsg = (remoteConrolMsg: RemoteControlMsg) => {
    if (!remoteConrolMsg || remoteConrolMsg.code !== 200) {
      console.log('Invalid Remote Control Message :: code is not 200');
      return;
    }

    const data = remoteConrolMsg.data;
    if (!data) {
      console.log('Invalid Remote Control Message :: data is undefined');
      return;
    }

    const msgTime = remoteConrolMsg.metadata.date;
    const msgMainTimer = data.mainTimer;
    const msgInjuryTimer = data.injuryTimer;
    const msgInjuryInfo = data.injuryInfo;
    const msgTeamA = data.teamA;
    const msgTeamB = data.teamB;
    const msgTeamAStyle = data.teamAStyle;
    const msgTeamBStyle = data.teamBStyle;
    const msgMatchName = data.matchName;

    // 메인 타이머
    if (msgMainTimer) {
      if (msgMainTimer.isRunning) {
        const delTime = deltaTime(new Date(msgTime), new Date());
        console.log('deltaTime :: ', delTime);
        const syncTime = getSyncedTime(
          msgMainTimer.time,
          msgMainTimer.milliseconds,
          delTime,
        );
        console.log('msg Time :: ', msgMainTimer.time);
        console.log('msg Mil  :: ', msgMainTimer.milliseconds);
        console.log('syncTime :: ', syncTime);

        const syncMinSecTime = {
          min: syncTime.min,
          sec: syncTime.sec,
        };
        const syncMil = syncTime.mil;

        mainTimer.mils.updateMiliseconds(syncMil);
        startMainTimer(syncMinSecTime);
      } else {
        pauseMainTimer();
        setMainTimer(msgMainTimer.time);
      }
    }

    // 추가 타이머
    if (msgInjuryTimer) {
      if (msgInjuryTimer.isRunning) {
        startInjuryTimer(msgInjuryTimer.time);
      } else {
        pauseInjuryTimer();
        setInjuryTimer(msgInjuryTimer.time);
      }
    }

    // 추가 시간 정보
    if (msgInjuryInfo) {
      if (msgInjuryInfo.isShowInjuryTimer) {
        showInjuryTimer();
      } else {
        disappearInjuryTimer();
      }
      updateGivenInjuryTime(msgInjuryInfo.givenInjuryTime);
    }

    // 팀 정보
    if (msgTeamA) {
      // category code name score uniform
      updateTeamA('category', msgTeamA.category);
      updateTeamA('code', msgTeamA.code);
      updateTeamA('name', msgTeamA.name);
      updateTeamA('score', msgTeamA.score);
      updateTeamA('uniform', msgTeamA.uniform);
    }
    if (msgTeamB) {
      updateTeamB('category', msgTeamB.category);
      updateTeamB('code', msgTeamB.code);
      updateTeamB('name', msgTeamB.name);
      updateTeamB('score', msgTeamB.score);
      updateTeamB('uniform', msgTeamB.uniform);
    }

    // 팀 스타일
    if (msgTeamAStyle) {
      updateTeamAStyle('fontColor', msgTeamAStyle.fontColor);
      updateTeamAStyle('fontWeight', msgTeamAStyle.fontWeight);
    }
    if (msgTeamBStyle) {
      updateTeamBStyle('fontColor', msgTeamBStyle.fontColor);
      updateTeamBStyle('fontWeight', msgTeamBStyle.fontWeight);
    }

    // 매치 이름
    if (msgMatchName) {
      updateMatchName(msgMatchName);
    }

    console.log('Msg Date :: ', remoteConrolMsg.metadata.date);
    console.log('local Date :: ', new Date().toISOString());
  };

  /**
   * @param timerTime 메세지의 타이머 시간
   * @param mil 메세지의 타이머 밀리초
   * @param deltaTime 메세지 발신자의 시간과 로컬의 시간 차이
   * @returns
   */
  const getSyncedTime: GetSyncedTimeType = (
    timerTime: Time, // { min: number, sec: number}
    mil: number, // millisec
    deltaTime: number, // millisec
  ) => {
    const milResult = (deltaTime + mil) % 1000;

    const secRound = Math.floor((deltaTime + mil) / 1000);
    const secTemp = timerTime.sec + secRound;
    const secResult = secTemp % 60;

    const minRound = Math.floor(secTemp / 60);
    const minResult = timerTime.min + minRound;

    return { min: minResult, sec: secResult, mil: milResult };
  };

  const deltaTime = (msgTime: Date, nowTime: Date) => {
    return nowTime.getTime() - msgTime.getTime();
  };

  return <></>;
};

export default RemoteReceiver;
