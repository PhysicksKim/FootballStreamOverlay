import React from 'react';
import '../../styles/board/InjuryTimeBoard.scss';

interface TimeBoardProps {
  timeDisplay: string;
  givenInjuryTime?: number;
}

const InjuryTimeBoard: React.FC<TimeBoardProps> = ({
  timeDisplay,
  givenInjuryTime = 0,
}) => {
  return (
    <div className='injury-time-container'>
      <div className='injury-time-wrapper'>
        <div className='injury-timer'>{timeDisplay}</div>
        <div className='given-injury-time'>+{givenInjuryTime}</div>
      </div>
    </div>
  );
};

export default InjuryTimeBoard;
