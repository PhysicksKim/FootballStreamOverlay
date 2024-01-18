import React from 'react';
import '../styles/MainTimeBoard.scss';

interface TimeBoardProps {
  timeDisplay: string;
}

const MainTimeBoard: React.FC<TimeBoardProps> = ({ timeDisplay }) => {
  return (
    <div className='main-time-container'>
      <div className='main-time-wrapper'>
        <div className='main-time-board'>{timeDisplay}</div>
      </div>
    </div>
  );
};

export default MainTimeBoard;
