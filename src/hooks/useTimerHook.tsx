import { useTimer } from 'react-use-precision-timer';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { EventEmitter } from 'events';
import { Time } from '@src/types/types';

export interface TimerMilliseconds {
  milliseconds: number;
  updateMiliseconds: (milliseconds: number) => void;
}

export interface TimerState {
  time: {
    min: number;
    sec: number;
  };
  start: (minutes?: number, seconds?: number) => void;
  stop: () => void;
  resume: () => void;
  pause: () => void;
  set: (minutes?: number, seconds?: number) => void;
  isRunning: boolean;
  /**
   * milliseconds: number;
   * updateMiliseconds: (milliseconds: number) => void;
   */
  mils: TimerMilliseconds;
}

const useTimerHook = (): [TimerState, EventEmitter] => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [eventEmitter] = useState(new EventEmitter());
  const [time, setTime] = useState<Time>({ min: 0, sec: 0 });
  const [isRunning, setIsRunning] = useState(false);

  // eventListener 에서는 state 변수가 업데이트 안되니까, ref 로 넘겨줘야함
  const totalSecondsRef = useRef(totalSeconds);

  // pauseTimes : 전반, 후반, 연장 전반, 연장 후반 시간(초 단위)
  const pauseTimes: number[] = [45 * 60, 90 * 60, 105 * 60, 120 * 60];

  const tick = useCallback(() => {
    let isRoundUp = false;

    setMilliseconds((prevMilliseconds) => {
      if (prevMilliseconds >= 900) {
        isRoundUp = true;
        return prevMilliseconds - 900;
      } else {
        return prevMilliseconds + 100;
      }
    });

    if (isRoundUp) {
      setTotalSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;

        eventEmitter.emit('secondsUpdated');
        return newSeconds;
      });
    }
  }, [eventEmitter]);

  useEffect(() => {
    checkForPauseTime(totalSeconds);

    if (totalSeconds > 120 * 60) {
      eventEmitter.emit('timeExceeded');
      setTotalSeconds(120 * 60);
    }
  }, [totalSeconds]);

  /**
   * Precision-Timer 라이브러리를 사용해서 0.1초마다 tick 함수 실행
   */
  const timer = useTimer(
    {
      delay: 100,
      // fireOnStart: true,
      startImmediately: false,
    },
    tick,
  );

  useEffect(() => {
    setIsRunning(timer.isRunning());
  }, [timer.isRunning()]);

  useEffect(() => {
    totalSecondsRef.current = totalSeconds;
  }, [totalSeconds]);

  useEffect(() => {
    eventEmitter.on('secondsUpdated', () => {
      const time = parseToTime(totalSecondsRef.current);
      setTime(time);
    });

    eventEmitter.on('timeExceeded', () => {
      pause();
      setTotalSeconds(120 * 60);
      const time = parseToTime(120 * 60);
      setTime(time);
    });
  }, []);

  const start = useCallback(
    (minutes = 0, seconds = 0) => {
      setTotalSeconds(minutes * 60 + seconds);
      timer.start();
    },
    [timer],
  );

  const set = useCallback(
    (minutes: number, seconds: number) => {
      setTotalSeconds(minutes * 60 + seconds);
    },
    [timer],
  );

  const resume = useCallback(() => {
    timer.resume();
  }, [timer]);

  const stop = useCallback(() => {
    timer.stop();
  }, [timer]);

  const pause = useCallback(() => {
    timer.pause();
  }, [timer]);

  const parseToTime = useCallback((nowSec: number): Time => {
    const minutes = Math.floor(nowSec / 60);
    const seconds = nowSec % 60;
    return { min: minutes, sec: seconds };
  }, []);

  // 하프 타임 도달한 경우 메인 타이머 멈춤
  const checkForPauseTime = useCallback((nowSecs: number) => {
    const index = pauseTimes.indexOf(nowSecs);

    if (index !== -1) {
      const events = [
        'firstHalfStop',
        'secondHalfStop',
        'firstExtraTimeStop',
        'secondExtraTimeStop',
      ];
      if (isRunning) {
        eventEmitter.emit(events[index]);
        eventEmitter.emit('halfTimeStop'); // 추가시간 표시는 halfTimeStop 이벤트로 인식
        pause();
      }
    }
  }, []);

  const updateMiliseconds: (milliseconds: number) => void = (
    milliseconds: number,
  ) => {
    setMilliseconds(milliseconds);
  };

  return [
    {
      time: { min: Math.floor(totalSeconds / 60), sec: totalSeconds % 60 },
      start,
      stop,
      resume,
      pause,
      set,
      isRunning,
      mils: { milliseconds, updateMiliseconds },
    },
    eventEmitter,
  ];
};

export default useTimerHook;
