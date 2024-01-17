import { useTimer } from 'react-use-precision-timer';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { EventEmitter } from 'events';

const useTimerHook = () => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [eventEmitter] = useState(new EventEmitter());
  // pauseTimes : 전반, 후반, 연장 전반, 연장 후반 시간(초 단위)
  const pauseTimes: number[] = [45 * 60, 90 * 60, 105 * 60, 120 * 60];

  const tick = useCallback(() => {
    setTotalSeconds((prevSeconds) => {
      const newSeconds = prevSeconds + 1;

      eventEmitter.emit('secondsUpdated');
      checkForPauseTime(newSeconds);

      if (newSeconds > 120 * 60) {
        eventEmitter.emit('timeExceeded');
      }
      return newSeconds;
    });
  }, [eventEmitter]);

  const timer = useTimer({ delay: 1000, startImmediately: false }, tick);

  const start = useCallback(
    (minutes = 0, seconds = 0) => {
      setTotalSeconds(minutes * 60 + seconds);
      timer.start();
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

  const getCurrentTime = useCallback((nowSec: number) => {
    console.log('nowSec : ', nowSec);
    const minutes = Math.floor(nowSec / 60);
    const seconds = nowSec % 60;
    return `${minutes}:${seconds}`;
  }, []);

  // 하프 타임일시, 타이머 멈추고 event emit
  const checkForPauseTime = (nowSecs: number) => {
    const index = pauseTimes.indexOf(nowSecs);

    if (index !== -1) {
      const events = [
        'firstHalfStop',
        'secondHalfStop',
        'firstExtraTimeStop',
        'secondExtraTimeStop',
      ];
      eventEmitter.emit(events[index]);

      pause();
    }
  };

  return {
    start,
    stop,
    resume,
    pause,
    getCurrentTime,
    eventEmitter,
    totalSeconds,
  };
};

export default useTimerHook;
