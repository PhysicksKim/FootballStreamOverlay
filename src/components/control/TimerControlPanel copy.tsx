import React, { useEffect, useState } from 'react';
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
import { TimerWrapper } from '../TimerRoot';
import '../../styles/TimerControlPanel.scss';

interface TimerControlPanelProps {
  mainTimerWrapper: TimerWrapper;
  injuryTimerWrapper: TimerWrapper;
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  setMatchName: React.Dispatch<React.SetStateAction<string>>;
}

const TimerControlPanel: React.FC<TimerControlPanelProps> = ({
  mainTimerWrapper,
  injuryTimerWrapper,
  showInjuryTimer,
  disappearInjuryTimer,
  isShowInjuryTimer,
  updateGivenInjuryTime,
  setMatchName,
}) => {
  const [mainMinutes, setMainMinutes] = useState(0);
  const [mainSeconds, setMainSeconds] = useState(0);
  const [isMainTimerRunning, setIsMainTimerRunning] = useState(false);
  const [injuryMinutes, setInjuryMinutes] = useState(0);
  const [injurySeconds, setInjurySeconds] = useState(0);
  const [isInjuryTimerRunning, setIsInjuryTimerRunning] = useState(false);

  // --- Main Timer ---
  const toggleMainTimerRunning = () => {
    if (isMainTimerRunning) {
      mainTimerWrapper.pauseTimer();
    } else {
      mainTimerWrapper.resumeTimer();
    }
    setIsMainTimerRunning(!isMainTimerRunning);
  };

  const startMainTimer = () => {
    setIsMainTimerRunning(true);
    if (mainMinutes >= 120) {
      mainTimerWrapper.startTimer({ min: 120, sec: 0 });
      setMainMinutes(120);
      setMainSeconds(0);
    } else {
      mainTimerWrapper.startTimer({ min: mainMinutes, sec: mainSeconds });
    }
  };

  const startMainTimerWithTime: (time: Time) => void = ({ min, sec }) => {
    setIsMainTimerRunning(true);
    mainTimerWrapper.startTimer({ min: min, sec: sec });
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

  // --- Injury Timer ---
  const toggleInjuryTimerRunning = () => {
    if (isInjuryTimerRunning) {
      injuryTimerWrapper.pauseTimer();
    } else {
      injuryTimerWrapper.resumeTimer();
    }
    setIsInjuryTimerRunning(!isInjuryTimerRunning);
  };

  const toggleShowInjuryTimer = () => {
    if (isShowInjuryTimer) {
      disappearInjuryTimer();
    } else {
      showInjuryTimer();
    }
  };

  const startInjuryTimer = () => {
    setIsInjuryTimerRunning(true);
    showInjuryTimer();
    injuryTimerWrapper.startTimer({ min: 0, sec: 0 });
  };

  // injury timer 는 preset 을 쓰지 않으므로, 현재 사용처가 없음
  const startInjuryTimerWithTime = () => {
    setIsInjuryTimerRunning(true);
    injuryTimerWrapper.startTimer({ min: injuryMinutes, sec: injurySeconds });
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
    injuryTimerWrapper.timer.stop();
    setIsInjuryTimerRunning(false);
    disappearInjuryTimer();
  };

  // --- Main+Injury Timer Presets ---

  // --- wait time preset ---
  const setWaitFirstHalf = () => {
    setMainMinutes(0);
    setMainSeconds(0);
    stopInjuryTimer();
    mainTimerWrapper.setTimer({ min: 0, sec: 0 });
    mainTimerWrapper.pauseTimer();
  };

  const setWaitSecondHalf = () => {
    setMainMinutes(45);
    setMainSeconds(0);
    stopInjuryTimer();
    mainTimerWrapper.setTimer({ min: 45, sec: 0 });
    mainTimerWrapper.pauseTimer();
  };

  const setWaitOvertimeFirstHalf = () => {
    setMainMinutes(90);
    setMainSeconds(0);
    stopInjuryTimer();
    mainTimerWrapper.setTimer({ min: 90, sec: 0 });
    mainTimerWrapper.pauseTimer();
  };

  const setWaitOvertimeSecondHalf = () => {
    setMainMinutes(105);
    setMainSeconds(0);
    stopInjuryTimer();
    mainTimerWrapper.setTimer({ min: 105, sec: 0 });
    mainTimerWrapper.pauseTimer();
  };

  // --- start time presets ---
  const setFirstHalf = () => {
    setMainMinutes(0);
    setMainSeconds(0);
    startMainTimerWithTime({ min: 0, sec: 0 });
    stopInjuryTimer();
  };

  const setSecondHalf = () => {
    setMainMinutes(45);
    setMainSeconds(0);
    startMainTimerWithTime({ min: 45, sec: 0 });
    stopInjuryTimer();
  };

  const setOvertimeFirstHalf = () => {
    setMainMinutes(90);
    setMainSeconds(0);
    startMainTimerWithTime({ min: 90, sec: 0 });
    stopInjuryTimer();
  };

  const setOvertimeSecondHalf = () => {
    setMainMinutes(105);
    setMainSeconds(0);
    startMainTimerWithTime({ min: 105, sec: 0 });
    stopInjuryTimer();
  };

  // --- injury time start preset ---
  const setStartFirstHalfInjury = () => {
    const time: Time = { min: 45, sec: 0 };
    mainTimerWrapper.setTimer(time);
    mainTimerWrapper.pauseTimer();
    startInjuryTimer();
    showInjuryTimer();
  };
  const setStartSecondHalfInjury = () => {
    const time: Time = { min: 90, sec: 0 };
    mainTimerWrapper.setTimer(time);
    mainTimerWrapper.pauseTimer();
    startInjuryTimer();
    showInjuryTimer();
  };
  const setStartOvertimeFirstHalfInjury = () => {
    const time: Time = { min: 105, sec: 0 };
    mainTimerWrapper.setTimer(time);
    mainTimerWrapper.pauseTimer();
    startInjuryTimer();
    showInjuryTimer();
  };
  const setStartOvertimeSecondHalfInjury = () => {
    const time: Time = { min: 120, sec: 0 };
    mainTimerWrapper.setTimer(time);
    mainTimerWrapper.pauseTimer();
    startInjuryTimer();
    showInjuryTimer();
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

  return (
    <div className='timer-time-set-box'>
      <div className='main-timer-panel'>
        <div className='input-group minutes-group'>
          <div className='input-upper-group minutes-upper'>
            <label htmlFor='minutes-input-id'>분</label>
            <button
              className='input-plus minutes-plus-btn'
              onClick={(e) =>
                setMainMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className='input-plus minutes-minus-btn'
              onClick={(e) =>
                setMainMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
              }
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <input
            className='minutes-input'
            id='minutes-input-id'
            type='number'
            placeholder='Minutes'
            value={Number(mainMinutes).toString()}
            onChange={(e) => updateMainMinutes(e.target.value)}
          />
        </div>
        <div className='input-group seconds-group'>
          <div className='input-upper-group seconds-upper'>
            <label htmlFor='seconds-input-id'>초</label>
            <button
              className='input-plus seconds-plus-btn'
              onClick={(e) =>
                setMainSeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className='input-plus seconds-minus-btn'
              onClick={(e) =>
                setMainSeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
              }
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <input
            className='seconds-input'
            id='seconds-input-id'
            type='number'
            placeholder='Seconds'
            value={Number(mainSeconds).toString()}
            onChange={(e) => updateMainSeconds(e.target.value)}
          />
        </div>
        <div className='timer-buttons'>
          <button onClick={startMainTimer}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button onClick={toggleMainTimerRunning}>
            {isMainTimerRunning ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faReply} />
            )}
          </button>
        </div>
        <div className='gametime-preset-buttons'>
          <div className='wait-buttons'>
            <button onClick={setWaitFirstHalf}>전반 대기</button>
            <button onClick={setWaitSecondHalf}>후반 대기</button>
            <button onClick={setWaitOvertimeFirstHalf}>연전 대기</button>
            <button onClick={setWaitOvertimeSecondHalf}>연후 대기</button>
          </div>
          <div className='start-buttons'>
            <button onClick={setFirstHalf}>전반 시작</button>
            <button onClick={setSecondHalf}>후반 시작</button>
            <button onClick={setOvertimeFirstHalf}>연전 시작</button>
            <button onClick={setOvertimeSecondHalf}>연후 시작</button>
          </div>
          <div className='overtime-start-buttons'>
            <button onClick={setStartFirstHalfInjury}>전반 추가</button>
            <button onClick={setStartSecondHalfInjury}>후반 추가</button>
            <button onClick={setStartOvertimeFirstHalfInjury}>연전 추가</button>
            <button onClick={setStartOvertimeSecondHalfInjury}>
              연후 추가
            </button>
          </div>
        </div>
      </div>
      {/* Injury Timer Panel */}
      <div className='injury-timer-panel'>
        <div className='input-group minutes-group'>
          <div className='input-upper-group minutes-upper'>
            <label htmlFor='minutes-input-id'>분</label>
            <button
              className='input-plus minutes-plus-btn'
              onClick={(e) =>
                setInjuryMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className='input-plus minutes-minus-btn'
              onClick={(e) =>
                setInjuryMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
              }
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <input
            className='minutes-input'
            id='minutes-input-id'
            type='number'
            placeholder='Minutes'
            value={Number(injuryMinutes).toString()}
            onChange={(e) => updateInjuryMinutes(e.target.value)}
          />
        </div>
        <div className='input-group seconds-group'>
          <div className='input-upper-group seconds-upper'>
            <label htmlFor='seconds-input-id'>초</label>
            <button
              className='input-plus seconds-plus-btn'
              onClick={(e) =>
                setInjurySeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className='input-plus seconds-minus-btn'
              onClick={(e) =>
                setInjurySeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
              }
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <input
            className='seconds-input'
            id='seconds-input-id'
            type='number'
            placeholder='Seconds'
            value={Number(injurySeconds).toString()}
            onChange={(e) => updateInjurySeconds(e.target.value)}
          />
        </div>
        <div className='timer-buttons'>
          <button onClick={startInjuryTimerWithTime}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button onClick={toggleInjuryTimerRunning}>
            {isInjuryTimerRunning ? (
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
          <input
            className='given-injury-time-input'
            type='number'
            placeholder='추가시간'
            onChange={(e) => changeGivenInjuryTime(e.target.value)}
          ></input>
          <input
            className='match-title-text-input'
            type='text'
            placeholder='경기 타이틀'
            onChange={(e) => {
              const title = e.target.value.trim();
              if (!title) {
                setMatchName('아시안컵 E조 조별 예선');
              } else {
                setMatchName(e.target.value);
              }
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default TimerControlPanel;
