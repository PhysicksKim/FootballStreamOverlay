import { useInjuryTimerManager } from '@src/contexts/timers/injury/InjuryTimerManagerProvider';
import { useMainTimerManager } from '@src/contexts/timers/main/MainTimerManagerProvider';
import { showInjuryTimer } from '@src/redux/slices/InjuryTimeInfoSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default React.memo(function TimerStop() {
  // 타이머
  const mainTimerManager = useMainTimerManager();
  const injuryTimerManager = useInjuryTimerManager();

  const dispatch = useDispatch();

  useEffect(() => {
    mainTimerManager.eventEmitter.on('halfTimeStop', () => {
      dispatch(showInjuryTimer());
      injuryTimerManager.startTimer({ min: 0, sec: 0 });
    });
  }, []);

  return <></>;
});
