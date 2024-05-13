import { useTimer } from 'react-use-precision-timer';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { EventEmitter } from 'events';
import { Time } from '@src/types/types';
import { CorsWorker } from './CorsWorker';

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
  adjustTimeSink: (sec: number) => void;
  isRunning: boolean;
  mils: TimerMilliseconds;
}

const useTimerHook = (): [TimerState, EventEmitter] => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [eventEmitter] = useState(new EventEmitter());
  const [time, setTime] = useState<Time>({ min: 0, sec: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [suppressHalfstop, setSuppressHalfstop] = useState(false);

  // eventListener 에서는 state 변수가 업데이트 안되니까, ref 로 넘겨줘야함
  const totalSecondsRef = useRef(totalSeconds);

  // WebWorker 사용한 타이머 틱
  const workerRef = useRef<Worker | null>(null);

  // pauseTimes : 전반, 후반, 연장 전반, 연장 후반 시간(초 단위)
  const pauseTimes: number[] = [45 * 60, 90 * 60, 105 * 60, 120 * 60];

  // const tick = useCallback(() => {
  //   let isRoundUp = false;

  //   setMilliseconds((prevMilliseconds) => {
  //     if (prevMilliseconds >= 900) {
  //       isRoundUp = true;
  //       return prevMilliseconds - 900;
  //     } else {
  //       return prevMilliseconds + 100;
  //     }
  //   });

  //   if (isRoundUp) {
  //     setTotalSeconds((prevSeconds) => {
  //       const newSeconds = prevSeconds + 1;

  //       eventEmitter.emit('secondsUpdated');
  //       return newSeconds;
  //     });
  //   }
  // }, [eventEmitter]);

  useEffect(() => {
    checkForPauseTime(totalSeconds);

    if (totalSeconds > 120 * 60) {
      eventEmitter.emit('timeExceeded');
      setTotalSeconds(120 * 60);
    }
  }, [totalSeconds]);

  useEffect(() => {
    totalSecondsRef.current = totalSeconds;
    const time = parseToTime(totalSecondsRef.current);
    setTime(time);
  }, [totalSeconds]);

  useEffect(() => {
    eventEmitter.on('secondsUpdated', () => {
      setTotalSeconds((prev) => prev + 1);
    });

    eventEmitter.on('timeExceeded', () => {
      pause();
      setTotalSeconds(120 * 60);
      const time = parseToTime(120 * 60);
      setTime(time);
    });
  }, []);

  const parseToTime = useCallback((nowSec: number): Time => {
    const minutes = Math.floor(nowSec / 60);
    const seconds = nowSec % 60;
    return { min: minutes, sec: seconds };
  }, []);

  // 하프 타임 도달한 경우 메인 타이머 멈춤
  const checkForPauseTime = useCallback(
    (nowSecs: number) => {
      if (suppressHalfstop) {
        setSuppressHalfstop(false);
        return;
      }

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
    },
    [isRunning, suppressHalfstop],
  );

  const updateMiliseconds: (milliseconds: number) => void = (
    milliseconds: number,
  ) => {
    setMilliseconds(milliseconds);
  };

  const adjustTimeSink = useCallback((sec: number) => {
    setTotalSeconds((prev) => (prev + sec > 0 ? prev + sec : 0));
  }, []);

  // ------ Web Worker Timer Refactoring ------
  // tick 마다 0.1초씩 증가. 1초가 되면 secondsUpdated 이벤트 발생
  const tickWebWorker = () => {
    setMilliseconds((prevMils) => {
      if (prevMils >= 900) {
        eventEmitter.emit('secondsUpdated');
        return prevMils - 900;
      } else {
        return prevMils + 100;
      }
    });
  };

  useEffect(() => {
    async function initializeWorker() {
      const corsWorker = new CorsWorker(
        new URL('./TimerWebWorker.js', import.meta.url),
        { type: 'module', name: 'my-worker' },
      );
      workerRef.current = await corsWorker.createWorker();

      workerRef.current.onmessage = (e) => {
        if (e.data === 'tick') {
          tickWebWorker(); // 0.1초마다 tickWebWorker 함수 실행
        }
      };
    }

    // 비동기 함수 실행
    initializeWorker();

    // cleanup 함수
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage('stop');
        workerRef.current.terminate();
      }
    };
  }, []);

  const start = useCallback((minutes = 0, seconds = 0) => {
    setSuppressHalfstop(true);
    setTotalSeconds(minutes * 60 + seconds);
    setMilliseconds(0);
    setIsRunning(true);
    workerRef.current?.postMessage('start');
  }, []);

  const set = useCallback((minutes: number, seconds: number) => {
    setTotalSeconds(minutes * 60 + seconds);
    setMilliseconds(0);
    setIsRunning(false);
    workerRef.current?.postMessage('stop');
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
    workerRef.current?.postMessage('start');
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    workerRef.current?.postMessage('stop');
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    workerRef.current?.postMessage('stop');
  }, []);

  return [
    {
      time: { min: Math.floor(totalSeconds / 60), sec: totalSeconds % 60 },
      start,
      stop,
      resume,
      pause,
      set,
      adjustTimeSink,
      isRunning,
      mils: { milliseconds, updateMiliseconds },
    },
    eventEmitter,
  ];
};

export default useTimerHook;
