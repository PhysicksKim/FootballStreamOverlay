import React, { useEffect } from 'react';
import '../../styles/board/MainTimeBoard.scss';
import { useMainTimeDisplay } from '@src/contexts/timers/main/MainTimeDisplayProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';

const MainTimeBoard: React.FC<Record<string, never>> = () => {
  const { mainTimeDisplay, setMainTimeDisplay } = useMainTimeDisplay();

  return (
    <div className='main-time-container'>
      <div className='main-time-board'>
        <div className='main-time-text'>{mainTimeDisplay}</div>
      </div>
    </div>
  );
};

export default MainTimeBoard;
