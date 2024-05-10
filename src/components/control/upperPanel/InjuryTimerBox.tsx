import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faPlay,
  faPause,
  faReply,
  faEyeSlash,
  faEye,
  faCaretUp,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

export type InjuryTimerBoxProps = {
  injuryMinutes: number;
  injurySeconds: number;
  isRunning: boolean;
  isShowInjuryTimer: boolean;
  setInjuryMinutes: React.Dispatch<React.SetStateAction<number>>;
  updateInjuryMinutes: (input: string) => void;
  setInjurySeconds: React.Dispatch<React.SetStateAction<number>>;
  updateInjurySeconds: (input: string) => void;
  startInjuryTimerWithTime: () => void;
  toggleInjuryTimerRunning: () => void;
  toggleShowInjuryTimer: () => void;
};

const InjuryTimerBox: React.FC<InjuryTimerBoxProps> = ({
  injuryMinutes,
  injurySeconds,
  isRunning,
  isShowInjuryTimer,
  setInjuryMinutes,
  updateInjuryMinutes,
  setInjurySeconds,
  updateInjurySeconds,
  startInjuryTimerWithTime,
  toggleInjuryTimerRunning,
  toggleShowInjuryTimer,
}) => {
  return (
    <div className='injury-timer-box'>
      <div className='timer-box-index injury-timer-box-index'>
        <div className='index-text-wrapper'>추가</div>
      </div>
      <div className='minsec-set-box minutes-set-box'>
        <div className='minsec-button-box'>
          <button
            className='input-plus minutes-plus-btn'
            onClick={(e) =>
              setInjuryMinutes((prev) => (prev + 1 <= 120 ? prev + 1 : 0))
            }
          >
            <FontAwesomeIcon icon={faCaretUp} />
          </button>
          <button
            className='input-minus minutes-minus-btn'
            onClick={(e) =>
              setInjuryMinutes((prev) => (prev - 1 >= 0 ? prev - 1 : 120))
            }
          >
            <FontAwesomeIcon icon={faCaretDown} />
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
          <button
            className='input-plus seconds-plus-btn'
            onClick={(e) =>
              setInjurySeconds((prev) => (prev + 1 <= 59 ? prev + 1 : 0))
            }
          >
            <FontAwesomeIcon icon={faCaretUp} />
          </button>
          <button
            className='input-minus seconds-minus-btn'
            onClick={(e) =>
              setInjurySeconds((prev) => (prev - 1 >= 0 ? prev - 1 : 59))
            }
          >
            <FontAwesomeIcon icon={faCaretDown} />
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
      <div className='timer-control-btn-set-box'>
        <div className='playbtn-set-box'>
          <button onClick={startInjuryTimerWithTime}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button onClick={toggleInjuryTimerRunning}>
            {isRunning ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faReply} />
            )}
          </button>
        </div>
        <div className='injury-showbtn-set-box'>
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
  );
};

export default React.memo(
  InjuryTimerBox,
  (prev, next) =>
    prev.isShowInjuryTimer === next.isShowInjuryTimer &&
    prev.injuryMinutes === next.injuryMinutes &&
    prev.injurySeconds === next.injurySeconds &&
    prev.isRunning === next.isRunning,
);
