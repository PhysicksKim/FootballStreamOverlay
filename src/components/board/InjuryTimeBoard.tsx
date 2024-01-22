import React from 'react';
import '../../styles/board/InjuryTimeBoard.scss';
import { useInjuryTimeDisplay } from '@src/contexts/timers/injury/InjuryTimeDisplayProvider';

interface TimeBoardProps {
  givenInjuryTime?: number;
}

const InjuryTimeBoard: React.FC<TimeBoardProps> = ({ givenInjuryTime = 0 }) => {
  const { injuryTimeDisplay, setInjuryTimeDisplay } = useInjuryTimeDisplay();
  return (
    <div className='injury-time-container'>
      <div className='injury-time-wrapper'>
        <div className='injury-timer'>{injuryTimeDisplay}</div>
        <div className='given-injury-time'>+{givenInjuryTime}</div>
      </div>
    </div>
  );
};

export default InjuryTimeBoard;
