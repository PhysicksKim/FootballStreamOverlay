import React from 'react';
import '../styles/TimeBoard.scss';

interface TimeBoardProps {
  timeDisplay: string;
}

const TimeBoard: React.FC<TimeBoardProps> = ({ timeDisplay }) => {
  return (
    <div className='time-board-container'>
      <div className='flex-wrapper-1'>
        <div className='time-board'>{timeDisplay}</div>
      </div>
    </div>
  );
};

export default TimeBoard;
