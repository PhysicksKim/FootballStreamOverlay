import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InjuryTimeInfoContextProps {
  givenInjuryTime: number;
  isShowInjuryTimer: boolean;
  updateGivenInjuryTime: (min: number) => void;
  showInjuryTimer: () => void;
  disappearInjuryTimer: () => void;
}

const InjuryTimeInfoContext = createContext<
  InjuryTimeInfoContextProps | undefined
>(undefined);

/**
 * { givenInjuryTime, isShowInjuryTimer, updateGivenInjuryTime, showInjuryTimer, disappearInjuryTimer }
 * @returns InjuryTimeInfoContextProps : { givenInjuryTime, isShowInjuryTimer, updateGivenInjuryTime, showInjuryTimer, disappearInjuryTimer }
 */
export const useInjuryTimeInfo = () => {
  const context = useContext(InjuryTimeInfoContext);
  if (!context) {
    throw new Error(
      'useInjuryTimeInfo must be used within a InjuryTimeInfoProvider',
    );
  }
  return context;
};

export const InjuryTimeInfoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [givenInjuryTime, setGivenInjuryTime] = useState(0);
  const [isShowInjuryTimer, setIsShowInjuryTimer] = useState(false);

  // #region injury timer board methods
  const updateGivenInjuryTime = (min: number) => {
    setGivenInjuryTime(min);
  };

  const showInjuryTimer = () => {
    setIsShowInjuryTimer(true);
  };
  const disappearInjuryTimer = () => {
    setIsShowInjuryTimer(false);
  };
  // #endregion

  return (
    <InjuryTimeInfoContext.Provider
      value={{
        givenInjuryTime,
        isShowInjuryTimer,
        updateGivenInjuryTime,
        showInjuryTimer,
        disappearInjuryTimer,
      }}
    >
      {children}
    </InjuryTimeInfoContext.Provider>
  );
};
