import React, { useEffect } from 'react';
import '../../styles/board/MainTimeBoard.scss';
import { useMainTimeDisplay } from '@src/contexts/timers/main/MainTimeDisplayProvider';

const MainTimeBoard: React.FC<Record<string, never>> = () => {
  const { mainTimeDisplay: main, setMainTimeDisplay } = useMainTimeDisplay();

  return (
    <div className='main-time-container'>
      <div className='main-time-board'>
        {/* <div className='main-time-text'>{mainTimeDisplay}</div> */}
        <div className='main-time-text'>
          <div className='main-timer-1'>{main.substring(0, 1)}</div>
          <div className='main-timer-2'>{main.substring(1, 2)}</div>
          <div className='main-timer-3'>{main.substring(2, 3)}</div>
          <div className='main-timer-4'>{main.substring(3, 4)}</div>
          <div className='main-timer-5'>{main.substring(4, 5)}</div>
        </div>
      </div>
    </div>
  );
};

export default MainTimeBoard;
