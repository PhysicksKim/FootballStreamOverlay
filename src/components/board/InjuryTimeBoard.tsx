import React, { useEffect } from 'react';

import { useInjuryTimeDisplay } from '@src/contexts/timers/injury/InjuryTimeDisplayProvider';

import '@styles/board/InjuryTimeBoard.scss';

interface TimeBoardProps {
  givenInjuryTime?: number;
}

const InjuryTimeBoard: React.FC<TimeBoardProps> = ({ givenInjuryTime = 0 }) => {
  const { injuryTimeDisplay: injury, setInjuryTimeDisplay } =
    useInjuryTimeDisplay();

  return (
    <div className='injury-time-container'>
      <div className='injury-time-wrapper'>
        <div className='injury-timer-box'>
          <div className='injury-timer'>
            <div className='injury-timer-1'>{injury.substring(0, 1)}</div>
            <div className='injury-timer-2'>{injury.substring(1, 2)}</div>
            <div className='injury-timer-3'>{injury.substring(2, 3)}</div>
            <div className='injury-timer-4'>{injury.substring(3, 4)}</div>
            <div className='injury-timer-5'>{injury.substring(4, 5)}</div>
          </div>
        </div>
        <div className='given-injury-time'>+{givenInjuryTime}</div>
      </div>
    </div>
  );
};

export default InjuryTimeBoard;
