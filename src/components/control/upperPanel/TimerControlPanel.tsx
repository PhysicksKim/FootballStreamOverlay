import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';

import TimerPresetButtons from './TimerPresetButtons';
import MainTimerBox from './MainTimerBox';
import InjuryTimerBox from './InjuryTimerBox';
import TimerTitleBox from './TimerTitleBox';

import { Time } from '@src/types/types';
import {
  showInjuryTimer,
  disappearInjuryTimer,
} from '@src/redux/slices/InjuryTimeInfoSlice';

import '@styles/control/upperPanel/TimerControlPanel.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/redux/Store';

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
  updateGivenInjuryTime: (min: number) => void;
  updateMatchName: (matchName: string) => void;
}

const TimerControlPanel: React.FC<TimerControlPanelProps> = ({
  updateGivenInjuryTime,
  updateMatchName,
}) => {
  const dispatch = useDispatch();

  // Injury Timer Info
  const injuryTimerInfo = useSelector(
    (state: RootState) => state.injuryTimeInfo,
  );

  // Timer Contexts
  const mainTimerManager = useMainTimerManager();
  const injuryTimerManager = useInjuryTimerManager();

  // 타이머 시작 시간 설정을 위한 input태그 state 값들
  const [mainMinutes, setMainMinutes] = useState(0);
  const [mainSeconds, setMainSeconds] = useState(0);
  const [injuryMinutes, setInjuryMinutes] = useState(0);
  const [injurySeconds, setInjurySeconds] = useState(0);

  // #region Main Timer
  const toggleMainTimerRunning = (isRunning: boolean) => {
    if (isRunning) {
      mainTimerManager.pauseTimer();
    } else {
      mainTimerManager.resumeTimer();
    }
    // setIsMainTimerRunning(!isMainTimerRunning);
  };

  const startMainTimer = () => {
    if (mainMinutes >= 120) {
      mainTimerManager.startTimer({ min: 120, sec: 0 });
    } else {
      mainTimerManager.startTimer({ min: mainMinutes, sec: mainSeconds });
    }
    if (
      injuryTimerInfo.isShowInjuryTimer ||
      injuryTimerManager.timer.isRunning
    ) {
      stopInjuryTimer();
      dispatch(disappearInjuryTimer());
      setTimeout(() => {
        injuryTimerManager.setTimer({ min: 0, sec: 0 });
      }, 1000);
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
    if (injuryTimerManager.timer.isRunning) {
      injuryTimerManager.pauseTimer();
    } else {
      injuryTimerManager.resumeTimer();
    }
  };

  const toggleShowInjuryTimer = () => {
    if (injuryTimerInfo.isShowInjuryTimer) {
      dispatch(disappearInjuryTimer());
    } else {
      dispatch(showInjuryTimer());
    }
  };

  const startInjuryTimer = () => {
    // setIsInjuryTimerRunning(true);
    dispatch(showInjuryTimer());
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
    dispatch(disappearInjuryTimer());
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
  const presets: TimerPresets = useMemo(
    () => ({
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
          dispatch(showInjuryTimer());
        },
        SecondHalf: () => {
          const time: Time = { min: 90, sec: 0 };
          mainTimerManager.setTimer(time);
          mainTimerManager.pauseTimer();
          startInjuryTimer();
          dispatch(showInjuryTimer());
        },
        OverFirstHalf: () => {
          const time: Time = { min: 105, sec: 0 };
          mainTimerManager.setTimer(time);
          mainTimerManager.pauseTimer();
          startInjuryTimer();
          dispatch(showInjuryTimer());
        },
        OverSecondHalf: () => {
          const time: Time = { min: 120, sec: 0 };
          mainTimerManager.setTimer(time);
          mainTimerManager.pauseTimer();
          startInjuryTimer();
          dispatch(showInjuryTimer());
        },
      },
    }),
    [],
  );
  // #endregion

  const handleSinkPlus1sec = () => {
    mainTimerManager.timer.adjustTimeSink(1);
  };

  const handleSinkMinus1sec = () => {
    mainTimerManager.timer.adjustTimeSink(-1);
  };

  return (
    <div className='timer-control-panel-box'>
      <div className='timer-time-set-box'>
        <div className='timer-boxes-title'>타이머 설정</div>
        <MainTimerBox
          mainMinutes={mainMinutes}
          mainSeconds={mainSeconds}
          isRunning={mainTimerManager.timer.isRunning}
          setMainMinutes={setMainMinutes}
          updateMainMinutes={updateMainMinutes}
          setMainSeconds={setMainSeconds}
          updateMainSeconds={updateMainSeconds}
          startMainTimer={startMainTimer}
          toggleMainTimerRunning={toggleMainTimerRunning}
          handleSinkPlus1sec={handleSinkPlus1sec}
          handleSinkMinus1sec={handleSinkMinus1sec}
        ></MainTimerBox>
        <InjuryTimerBox
          injuryMinutes={injuryMinutes}
          injurySeconds={injurySeconds}
          isRunning={injuryTimerManager.timer.isRunning}
          isShowInjuryTimer={injuryTimerInfo.isShowInjuryTimer}
          setInjuryMinutes={setInjuryMinutes}
          updateInjuryMinutes={updateInjuryMinutes}
          setInjurySeconds={setInjurySeconds}
          updateInjurySeconds={updateInjurySeconds}
          startInjuryTimerWithTime={startInjuryTimerWithTime}
          toggleInjuryTimerRunning={toggleInjuryTimerRunning}
          toggleShowInjuryTimer={toggleShowInjuryTimer}
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
