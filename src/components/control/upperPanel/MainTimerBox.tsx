import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faReply,
  faCaretUp,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

export type MainTimerBoxProps = {
  mainMinutes: number;
  mainSeconds: number;
  isRunning: boolean;
  setMainMinutes: React.Dispatch<React.SetStateAction<number>>;
  updateMainMinutes: (input: string) => void;
  setMainSeconds: React.Dispatch<React.SetStateAction<number>>;
  updateMainSeconds: (input: string) => void;
  startMainTimer: () => void;
  toggleMainTimerRunning: (isRunning: boolean) => void;
  handleSinkPlus1sec: () => void;
  handleSinkMinus1sec: () => void;
};

const MainTimerBox: React.FC<MainTimerBoxProps> = ({
  mainMinutes,
  mainSeconds,
  isRunning,
  setMainMinutes,
  updateMainMinutes,
  setMainSeconds,
  updateMainSeconds,
  startMainTimer,
  toggleMainTimerRunning,
  handleSinkPlus1sec,
  handleSinkMinus1sec,
}) => {
  return (
    <div className='main-timer-box'>
      <div className='timer-box-index main-timer-box-index'>
        <div className='index-text-wrapper'>정규</div>
      </div>
      <div className='minsec-set-box minutes-set-box'>
        <div className='minsec-button-box'>
          <button
            className='input-plus minutes-plus-btn'
            onClick={(e) =>
              setMainMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
            }
          >
            <FontAwesomeIcon icon={faCaretUp} />
          </button>
          <button
            className='input-minus minutes-minus-btn'
            onClick={(e) =>
              setMainMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
            }
          >
            <FontAwesomeIcon icon={faCaretDown} />
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
          <button
            className='input-plus seconds-plus-btn'
            onClick={(e) =>
              setMainSeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
            }
          >
            <FontAwesomeIcon icon={faCaretUp} />
          </button>
          <button
            className='input-minus seconds-minus-btn'
            onClick={(e) =>
              setMainSeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
            }
          >
            <FontAwesomeIcon icon={faCaretDown} />
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
      <div className='timer-control-btn-set-box'>
        <div className='playbtn-set-box'>
          <button onClick={startMainTimer}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button onClick={() => toggleMainTimerRunning(isRunning)}>
            {isRunning ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faReply} />
            )}
          </button>
        </div>
      </div>
      <div className='time-sink-btn-box'>
        <button className='time-plus-sink-btn' onClick={handleSinkPlus1sec}>
          +1
        </button>
        <button className='time-minus-sink-btn' onClick={handleSinkMinus1sec}>
          -1
        </button>
      </div>
    </div>
  );
};

export default React.memo(MainTimerBox, (prev, next) => {
  return (
    prev.mainMinutes === next.mainMinutes &&
    prev.mainSeconds === next.mainSeconds &&
    prev.isRunning === next.isRunning
  );
});
