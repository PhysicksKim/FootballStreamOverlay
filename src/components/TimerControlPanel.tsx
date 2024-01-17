import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPause,
  faPlay,
  faPlus,
  faReply,
} from '@fortawesome/free-solid-svg-icons';

interface TimerControlPanelProps {
  updateTime: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

const TimerControlPanel: React.FC<TimerControlPanelProps> = ({
  updateTime,
  pauseTimer,
  resumeTimer,
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const toggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    updateTime({ min: minutes, sec: seconds });
  };

  const startTimerWithTime: (time: { min: number; sec: number }) => void = ({
    min,
    sec,
  }) => {
    setIsTimerRunning(true);
    updateTime({ min: min, sec: sec });
  };

  const updateMinutes = (input: string) => {
    if (!input) {
      setMinutes(0);
      return;
    }
    const newValue = parseInt(input, 10) || 0;
    setMinutes(newValue);
  };

  const updateSeconds = (input: string) => {
    if (!input) {
      setSeconds(0);
      return;
    }

    let newValue = parseInt(input, 10) || 0;

    if (newValue > 60) {
      newValue = 59;
    }
    setSeconds(newValue);
  };

  const setFirstHalf = () => {
    setMinutes(0);
    setSeconds(0);
    startTimerWithTime({ min: 0, sec: 0 });
  };

  const setSecondHalf = () => {
    setMinutes(45);
    setSeconds(0);
    startTimerWithTime({ min: 45, sec: 0 });
  };

  const setOvertimeFirstHalf = () => {
    setMinutes(90);
    setSeconds(0);
    startTimerWithTime({ min: 90, sec: 0 });
  };

  const setOvertimeSecondHalf = () => {
    setMinutes(105);
    setSeconds(0);
    startTimerWithTime({ min: 105, sec: 0 });
  };

  return (
    <div className='timer-time-set-box'>
      <div className='input-group minutes-group'>
        <div className='input-upper-group minutes-upper'>
          <label htmlFor='minutes-input-id'>분</label>
          <button
            className='input-plus minutes-plus-btn'
            onClick={(e) =>
              setMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            className='input-plus minutes-minus-btn'
            onClick={(e) =>
              setMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
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
          value={Number(minutes).toString()}
          onChange={(e) => updateMinutes(e.target.value)}
        />
      </div>
      <div className='input-group seconds-group'>
        <div className='input-upper-group seconds-upper'>
          <label htmlFor='seconds-input-id'>초</label>
          <button
            className='input-plus seconds-plus-btn'
            onClick={(e) =>
              setSeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            className='input-plus seconds-minus-btn'
            onClick={(e) =>
              setSeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
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
          value={Number(seconds).toString()}
          onChange={(e) => updateSeconds(e.target.value)}
        />
      </div>
      <div className='timer-buttons'>
        <button onClick={startTimer}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button onClick={toggleTimer}>
          {isTimerRunning ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faReply} />
          )}
        </button>
      </div>
      <div className='gametime-preset-buttons'>
        <button onClick={setFirstHalf}>전반 시작</button>
        <button onClick={setSecondHalf}>후반 시작</button>
        <button onClick={setOvertimeFirstHalf}>연장전반 시작</button>
        <button onClick={setOvertimeSecondHalf}>연장후반 시작</button>
        <button>하프타임</button>
        <button>연장준비</button>
        <button>연장하프타임</button>
      </div>
    </div>
  );
};

export default TimerControlPanel;
