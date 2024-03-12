import React, { useEffect, useState } from 'react';
import '../../styles/board/MainTimeBoard.scss';
import { useMainTimeDisplay } from '@src/contexts/timers/main/MainTimeDisplayProvider';

const MainTimeBoard: React.FC<Record<string, never>> = () => {
  const { mainTimeDisplay: main, setMainTimeDisplay } = useMainTimeDisplay();

  const [mainTimeArr, setMainTimeArr] = useState<string[]>([]);

  useEffect(() => {
    const arr: string[] = main.split('');
    if (main.length === 5) {
      arr.unshift('');
    }
    setMainTimeArr(arr);
  }, [main]);

  return (
    <div className='main-time-container'>
      <div className='main-time-board'>
        {/* <div className='main-time-text'>{mainTimeDisplay}</div> */}
        <div className='main-time-text'>
          <div className='main-timer-0'>{mainTimeArr[0]}</div>
          <div className='main-timer-1'>{mainTimeArr[1]}</div>
          <div className='main-timer-2'>{mainTimeArr[2]}</div>
          <div className='main-timer-3'>{mainTimeArr[3]}</div>
          <div className='main-timer-4'>{mainTimeArr[4]}</div>
          <div className='main-timer-5'>{mainTimeArr[5]}</div>
        </div>
      </div>
    </div>
  );
};

export default MainTimeBoard;
