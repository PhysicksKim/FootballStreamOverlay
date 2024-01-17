import { EventEmitter } from 'events';
import { useTimer } from 'react-use-precision-timer';

class Timer extends EventEmitter {
  private totalSeconds: number;
  private timerInterval?: NodeJS.Timeout;
  private stopTimes: number[];
  private timer: ReturnType<typeof useTimer>;

  constructor() {
    super();
    this.totalSeconds = 0;
    this.stopTimes = [45 * 60, 90 * 60, 105 * 60, 120 * 60]; // 전반, 후반, 연장 전반, 연장 후반 시간(초 단위)
    this.timer = useTimer(
      {
        delay: 1000,
        startImmediately: false, // 타이머를 즉시 시작하지 않음
      },
      this.tick,
    );
  }

  tick = (): void => {
    console.log('tick called');
    this.totalSeconds++;
    this.emit('secondsUpdated');
    this.checkForStopTime();
    if (this.totalSeconds > 120 * 60) {
      this.emit('timeExceeded');
      this.timer.stop();
    }
  };

  start(minutes: number = 0, seconds: number = 0): void {
    this.stop();
    this.totalSeconds = minutes * 60 + seconds;
    this.timer.start(); // tick 콜백 함수 1초마다 실행
    /* 
    this.timerInterval = setInterval(() => {
      this.totalSeconds++;
      this.emit('secondsUpdated');
      this.checkForStopTime();
      if (this.totalSeconds > 120 * 60) {
        this.emit('timeExceeded');
        this.stop();
      }
    }, 1000); 
    */
  }

  restart(): void {
    this.stop();
    this.timerInterval = setInterval(() => {
      this.totalSeconds++;
      this.emit('secondsUpdated');
      this.checkForStopTime();
    }, 1000);
  }

  stop(): void {
    this.timer.stop();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  reset(minutes: number = 0, seconds: number = 0): void {
    this.stop();
    this.start(minutes, seconds);
  }

  // 하프타임에 타이머 멈춰야 함.
  private checkForStopTime(): void {
    if (this.stopTimes.includes(this.totalSeconds)) {
      this.emitStopEvent();
      this.stop();
    }
  }

  private emitStopEvent(): void {
    const events = [
      'firstHalfStop',
      'secondHalfStop',
      'firstExtraTimeStop',
      'secondExtraTimeStop',
    ];
    const index = this.stopTimes.indexOf(this.totalSeconds);
    if (index !== -1) {
      this.emit(events[index]);
    }
  }

  getCurrentTime(): string {
    console.log('getCurrentTime() called');
    const minutes = Math.floor(this.totalSeconds / 60);
    const seconds = this.totalSeconds % 60;
    return `${minutes}:${seconds}`;
  }
}

export default Timer;
