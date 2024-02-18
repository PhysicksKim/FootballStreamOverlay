import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faMinus,
  faPause,
  faPlay,
  faPlus,
  faReply,
} from '@fortawesome/free-solid-svg-icons';
import { Time } from '@src/types/types';
import '../../styles/control/TimerControlPanel.scss';
import TimerPresetButtons from './TimerPresetButtons';
import TimerTitleBox from './TimerTitleBox';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';

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
  // #endregion

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
    // setIsInjuryTimerRunning(false);
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
        <TimerTitleBox
          updateMatchName={updateMatchName}
          changeGivenInjuryTime={changeGivenInjuryTime}
        />
        <div className='main-timer-box'>
          <div className='timer-box-index main-timer-box-index'>
            메인 타이머
          </div>
          <div className='minsec-set-box minutes-set-box'>
            <div className='minsec-button-box'>
              <label htmlFor='main-minutes-input'>분</label>
              <button
                className='input-plus minutes-plus-btn'
                onClick={(e) =>
                  setMainMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                className='input-minus minutes-minus-btn'
                onClick={(e) =>
                  setMainMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
                }
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
            <div className='minsec-input-box'>
              <input
                key='main-minutes-input'
                id='main-minutes-input'
                className='minutes-input'
                type='number'
                placeholder='Minutes'
                value={Number(mainMinutes).toString()}
                onChange={(e) => updateMainMinutes(e.target.value)}
              />
            </div>
          </div>
          <div className='minsec-set-box seconds-set-box'>
            <div className='minsec-button-box'>
              <label htmlFor='main-seconds-input'>초</label>
              <button
                className='input-plus seconds-plus-btn'
                onClick={(e) =>
                  setMainSeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                className='input-minus seconds-minus-btn'
                onClick={(e) =>
                  setMainSeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
                }
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
            <div className='minsec-input-box'>
              <input
                key='main-seconds-input'
                id='main-seconds-input'
                className='seconds-input'
                type='number'
                placeholder='Seconds'
                value={Number(mainSeconds).toString()}
                onChange={(e) => updateMainSeconds(e.target.value)}
              />
            </div>
          </div>
          <div className='playbtn-set-box'>
            <button onClick={startMainTimer}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <button onClick={toggleMainTimerRunning}>
              {/* {isMainTimerRunning ? ( */}
              {mainTimerManager.timer.isRunning ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faReply} />
              )}
            </button>
          </div>
        </div>
        <div className='injury-timer-box'>
          <div className='timer-box-index injury-timer-box-index'>
            추가 타이머
          </div>
          <div className='minsec-set-box minutes-set-box'>
            <div className='minsec-button-box'>
              <label htmlFor='injury-minutes-input'>분</label>
              <button
                className='input-plus minutes-plus-btn'
                onClick={(e) =>
                  setInjuryMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                className='input-minus minutes-minus-btn'
                onClick={(e) =>
                  setInjuryMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
                }
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
            <div className='minsec-input-box'>
              <input
                key='injury-minutes-input'
                id='injury-minutes-input'
                className='minutes-input'
                type='number'
                placeholder='Minutes'
                value={Number(injuryMinutes).toString()}
                onChange={(e) => updateInjuryMinutes(e.target.value)}
              />
            </div>
          </div>
          <div className='minsec-set-box seconds-set-box'>
            <div className='minsec-button-box'>
              <label htmlFor='injury-seconds-input'>초</label>
              <button
                className='input-plus seconds-plus-btn'
                onClick={(e) =>
                  setInjurySeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                className='input-minus seconds-minus-btn'
                onClick={(e) =>
                  setInjurySeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
                }
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
            <div className='minsec-input-box'>
              <input
                key='injury-seconds-input'
                id='injury-seconds-input'
                className='seconds-input'
                type='number'
                placeholder='Seconds'
                value={Number(injurySeconds).toString()}
                onChange={(e) => updateInjurySeconds(e.target.value)}
              />
            </div>
          </div>
          <div className='playbtn-set-box'>
            <button onClick={startInjuryTimerWithTime}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <button onClick={toggleInjuryTimerRunning}>
              {/* {isInjuryTimerRunning ? ( */}
              {injuryTimerManager.timer.isRunning ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faReply} />
              )}
            </button>
            <button onClick={toggleShowInjuryTimer}>
              {isShowInjuryTimer ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className='timer-preset-set-box'>
        <div className='timer-preset-index'># 타이머 프리셋</div>
        <TimerPresetButtons presets={presets} />
      </div>
    </div>
  );
};

export default TimerControlPanel;
