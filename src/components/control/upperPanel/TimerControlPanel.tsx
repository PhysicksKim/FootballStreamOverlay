import React, { useState } from 'react';

import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';

import TimerPresetButtons from './TimerPresetButtons';
import MainTimerBox from './MainTimerBox';
import InjuryTimerBox from './InjuryTimerBox';
import TimerTitleBox from './TimerTitleBox';

import { Time } from '@src/types/types';

import '@styles/control/upperPanel/TimerControlPanel.scss';

export interface TimerPresets {
  wait: {
    FirstHalf: () => void;
    SecondHalf: () => void;
    OverFirstHalf: () => void;
    OverSecondHalf: () => void;
  };
  start: {
    FirstHalf: () => void;
    SecondHalf: () => void;
    OverFirstHalf: () => void;
    OverSecondHalf: () => void;
  };
  injury: {
    FirstHalf: () => void;
    SecondHalf: () => void;
    OverFirstHalf: () => void;
    OverSecondHalf: () => void;
  };
}

interface TimerControlPanelProps {
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const TimerControlPanel: React.FC<TimerControlPanelProps> = ({
  showInjuryTimer,
  disappearInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  // Timer Contexts
  const mainTimerManager = useMainTimerManager();
  const injuryTimerManager = useInjuryTimerManager();

  // 타이머 시작 시간 설정을 위한 input태그 state 값들
  const [mainMinutes, setMainMinutes] = useState(0);
  const [mainSeconds, setMainSeconds] = useState(0);
  // const [isMainTimerRunning, setIsMainTimerRunning] = useState(false);
  const [injuryMinutes, setInjuryMinutes] = useState(0);
  const [injurySeconds, setInjurySeconds] = useState(0);
  // const [isInjuryTimerRunning, setIsInjuryTimerRunning] = useState(false);

  // #region Main Timer
  const toggleMainTimerRunning = () => {
    if (mainTimerManager.timer.isRunning) {
      mainTimerManager.pauseTimer();
    } else {
      mainTimerManager.resumeTimer();
    }
    // setIsMainTimerRunning(!isMainTimerRunning);
  };

  const startMainTimer = () => {
    // setIsMainTimerRunning(true);
    if (mainMinutes >= 120) {
      mainTimerManager.startTimer({ min: 120, sec: 0 });
      // // 120분 이상은 120분으로 설정
      // setMainMinutes(120);
      // setMainSeconds(0);
    } else {
      mainTimerManager.startTimer({ min: mainMinutes, sec: mainSeconds });
    }
    if (isShowInjuryTimer) {
      stopInjuryTimer();
      disappearInjuryTimer();
    }
  };

  const startMainTimerWithTime: (time: Time) => void = ({ min, sec }) => {
    // setIsMainTimerRunning(true);
    mainTimerManager.startTimer({ min: min, sec: sec });
  };

  const updateMainMinutes = (input: string) => {
    if (!input) {
      setMainMinutes(0);
      return;
    }

    let newValue = parseInt(input, 10) || 0;
    if (newValue > 120) {
      newValue = 120;
    }
    setMainMinutes(newValue);
  };

  const updateMainSeconds = (input: string) => {
    if (!input) {
      setMainSeconds(0);
      return;
    }

    let newValue = parseInt(input, 10) || 0;
    if (newValue > 60) {
      newValue = 59;
    }
    setMainSeconds(newValue);
  };

  // #region Injury Timer
  const toggleInjuryTimerRunning = () => {
    // if (isInjuryTimerRunning) {
    if (mainTimerManager.timer.isRunning) {
      injuryTimerManager.pauseTimer();
    } else {
      injuryTimerManager.resumeTimer();
    }
    // setIsInjuryTimerRunning(!isInjuryTimerRunning);
  };

  const toggleShowInjuryTimer = () => {
    if (isShowInjuryTimer) {
      disappearInjuryTimer();
    } else {
      showInjuryTimer();
    }
  };

  const startInjuryTimer = () => {
    // setIsInjuryTimerRunning(true);
    showInjuryTimer();
    injuryTimerManager.startTimer({ min: 0, sec: 0 });
  };

  const startInjuryTimerWithTime = () => {
    // setIsInjuryTimerRunning(true);
    injuryTimerManager.startTimer({ min: injuryMinutes, sec: injurySeconds });
  };

  const updateInjuryMinutes = (input: string) => {
    if (!input) {
      setInjuryMinutes(0);
      return;
    }

    let newValue = parseInt(input, 10) || 0;
    if (newValue > 120) {
      newValue = 120;
    }
    setInjuryMinutes(newValue);
  };

  const updateInjurySeconds = (input: string) => {
    if (!input) {
      setInjurySeconds(0);
      return;
    }

    let newValue = parseInt(input, 10) || 0;
    if (newValue > 60) {
      newValue = 59;
    }
    setInjurySeconds(newValue);
  };

  const stopInjuryTimer = () => {
    injuryTimerManager.timer.stop();
    disappearInjuryTimer();
  };

  const changeGivenInjuryTime = (value: string) => {
    let val = Number.parseInt(value);
    if (!val) {
      updateGivenInjuryTime(0);
      return;
    }
    if (val < 0) {
      val = 0;
    }
    updateGivenInjuryTime(val);
  };
  // #endregion

  // #region Main/Injury Timer Presets button methods
  const presets: TimerPresets = {
    wait: {
      FirstHalf: () => {
        setMainMinutes(0);
        setMainSeconds(0);
        stopInjuryTimer();
        mainTimerManager.setTimer({ min: 0, sec: 0 });
        mainTimerManager.pauseTimer();
      },
      SecondHalf: () => {
        setMainMinutes(45);
        setMainSeconds(0);
        stopInjuryTimer();
        mainTimerManager.setTimer({ min: 45, sec: 0 });
        mainTimerManager.pauseTimer();
      },
      OverFirstHalf: () => {
        setMainMinutes(90);
        setMainSeconds(0);
        stopInjuryTimer();
        mainTimerManager.setTimer({ min: 90, sec: 0 });
        mainTimerManager.pauseTimer();
      },
      OverSecondHalf: () => {
        setMainMinutes(105);
        setMainSeconds(0);
        stopInjuryTimer();
        mainTimerManager.setTimer({ min: 105, sec: 0 });
        mainTimerManager.pauseTimer();
      },
    },
    start: {
      FirstHalf: () => {
        setMainMinutes(0);
        setMainSeconds(0);
        startMainTimerWithTime({ min: 0, sec: 0 });
        stopInjuryTimer();
      },
      SecondHalf: () => {
        setMainMinutes(45);
        setMainSeconds(0);
        startMainTimerWithTime({ min: 45, sec: 0 });
        stopInjuryTimer();
      },
      OverFirstHalf: () => {
        setMainMinutes(90);
        setMainSeconds(0);
        startMainTimerWithTime({ min: 90, sec: 0 });
        stopInjuryTimer();
      },
      OverSecondHalf: () => {
        setMainMinutes(105);
        setMainSeconds(0);
        startMainTimerWithTime({ min: 105, sec: 0 });
        stopInjuryTimer();
      },
    },
    injury: {
      FirstHalf: () => {
        const time: Time = { min: 45, sec: 0 };
        mainTimerManager.setTimer(time);
        mainTimerManager.pauseTimer();
        startInjuryTimer();
        showInjuryTimer();
      },
      SecondHalf: () => {
        const time: Time = { min: 90, sec: 0 };
        mainTimerManager.setTimer(time);
        mainTimerManager.pauseTimer();
        startInjuryTimer();
        showInjuryTimer();
      },
      OverFirstHalf: () => {
        const time: Time = { min: 105, sec: 0 };
        mainTimerManager.setTimer(time);
        mainTimerManager.pauseTimer();
        startInjuryTimer();
        showInjuryTimer();
      },
      OverSecondHalf: () => {
        const time: Time = { min: 120, sec: 0 };
        mainTimerManager.setTimer(time);
        mainTimerManager.pauseTimer();
        startInjuryTimer();
        showInjuryTimer();
      },
    },
  };
  // #endregion

  return (
    <div className='timer-control-panel-box'>
      <div className='timer-time-set-box'>
        <div className='timer-boxes-title'>타이머 설정</div>
        <MainTimerBox
          mainMinutes={mainMinutes}
          setMainMinutes={setMainMinutes}
          updateMainMinutes={updateMainMinutes}
          mainSeconds={mainSeconds}
          setMainSeconds={setMainSeconds}
          updateMainSeconds={updateMainSeconds}
          startMainTimer={startMainTimer}
          toggleMainTimerRunning={toggleMainTimerRunning}
          isRunning={mainTimerManager.timer.isRunning}
        ></MainTimerBox>
        <InjuryTimerBox
          injuryMinutes={injuryMinutes}
          setInjuryMinutes={setInjuryMinutes}
          updateInjuryMinutes={updateInjuryMinutes}
          injurySeconds={injurySeconds}
          setInjurySeconds={setInjurySeconds}
          updateInjurySeconds={updateInjurySeconds}
          startInjuryTimerWithTime={startInjuryTimerWithTime}
          toggleInjuryTimerRunning={toggleInjuryTimerRunning}
          isRunning={injuryTimerManager.timer.isRunning}
          toggleShowInjuryTimer={toggleShowInjuryTimer}
          isShowInjuryTimer={isShowInjuryTimer}
        ></InjuryTimerBox>
      </div>
      <div className='timer-preset-set-box'>
        <TimerPresetButtons presets={presets} />
      </div>

      <div className='match-title-set-box'>
        <TimerTitleBox
          updateMatchName={updateMatchName}
          // changeGivenInjuryTime={changeGivenInjuryTime}
        />
      </div>
    </div>
  );
};

export default TimerControlPanel;
