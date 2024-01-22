import { timeToZeroFillString } from '@src/classes/Utils';
import useTimerHook, { TimerState } from '@src/hooks/useTimerHook';
import { Time } from '@src/types/types';
import React, { ReactNode, createContext, useState } from 'react';

export interface TimerManager {
  timer: TimerState;
  startTimer: (time: { min: number; sec: number }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setTimer: (time: { min: number; sec: number }) => void;
}

// TODO : 이게 mainTimerDisplay 는 전광판에 쓰이고, mainTimerManager 에 담긴 것들은 컨트롤 패널에 쓰인다
// 그래서 이를 하나로 묶는 것 보다는 따로 분리하는 게 좋아보이는데
// 문제는 MainTimerProvider 에서는 하나의 context만 return 할 수 있다는 점이다.
// 그래서 MainTimerRoot 으로 컴포넌트를 만들고, 이 컴포넌트는 고차고차컴포넌트로 쓰는 방식을 생각했다
// 고차고차컴포넌트 => MainTimerRoot에서는 state 만 정의하고,
// Root 아래에 2개의 Provider 컴포넌트를 만든 다음 prop 로 필요한 것들만 전달해준다.
// MainTimerProvider 에는 TimerManager 를 주고 MainTimeDisplayProvider 에는 mainTimerDisplay 변수만 주는 것이다.

/*
<MainTimerStateRoot>
    <MainTimerProvider props={...}>
        <MainTimeDisplayProvider props={...}> 
            {children}
        </...>
    </...>
</MainTimerStateRoot>
 */
export const MainTimerContext = createContext<TimerManager | undefined>(
  undefined,
);

export const MainTimerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Timer Hook과 상태 관리 로직
  const [mainTimer, mainEventEmitter] = useTimerHook();

  const mainTimerManager: TimerManager = {
    timer: mainTimer,
    startTimer: (time: Time) => {
      mainTimer.start(time.min, time.sec);
    },
    resumeTimer: mainTimer.resume,
    pauseTimer: mainTimer.pause,
    setTimer: (time: Time) => {
      mainTimer.set(time.min, time.sec);
    },
  };

  return (
    <MainTimerContext.Provider value={mainTimerManager}>
      {children}
    </MainTimerContext.Provider>
  );
};

export const MainTimeDisplayContext = createContext<string | undefined>(
  undefined,
);

export const MainTimeDisplayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mainTimeDisplay, setMainTimeDisplay] = useState('00:00');

  return (
    <MainTimeDisplayContext.Provider value={mainTimeDisplay}>
      {children}
    </MainTimeDisplayContext.Provider>
  );
};
