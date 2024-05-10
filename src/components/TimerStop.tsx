import { useInjuryTimeInfo } from '@src/contexts/timers/injury/InjuryTimeInfoProvider';
import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import React, { useEffect } from 'react';

export default React.memo(function TimerStop() {
  // 타이머
  const mainTimerManager = useMainTimerManager();
  const injuryTimerManager = useInjuryTimerManager();
  const { showInjuryTimer } = useInjuryTimeInfo();

  useEffect(() => {
    mainTimerManager.eventEmitter.on('halfTimeStop', () => {
      showInjuryTimer();
      injuryTimerManager.startTimer({ min: 0, sec: 0 });
    });
  }, []);

  return <></>;
});
