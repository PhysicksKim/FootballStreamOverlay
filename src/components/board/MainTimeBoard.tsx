import React from 'react';
import '../../styles/board/MainTimeBoard.scss';

interface TimeBoardProps {
  timeDisplay: string;
}

const MainTimeBoard: React.FC<TimeBoardProps> = ({ timeDisplay }) => {
  return (
    <div className='main-time-container'>
      <div className='main-time-board'>
        <div className='main-time-text'>{timeDisplay}</div>
      </div>
    </div>
  );
};

export default MainTimeBoard;
