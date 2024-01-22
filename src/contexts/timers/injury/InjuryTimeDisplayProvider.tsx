import React, { ReactNode, createContext, useContext, useState } from 'react';

interface InjuryTimeDisplay {
  injuryTimeDisplay: string;
  setInjuryTimeDisplay: React.Dispatch<React.SetStateAction<string>>;
}

const InjuryTimeDisplayContext = createContext<InjuryTimeDisplay | undefined>(
  undefined,
);

/**
 * @returns InjuryTimeDisplay : { injuryTimeDisplay, setInjuryTimeDisplay }
 */
export const useInjuryTimeDisplay = (): InjuryTimeDisplay => {
  const context = useContext(InjuryTimeDisplayContext);
  if (!context) {
    throw new Error(
      'useInjuryTimeDisplay must be used within a InjuryTimerStateRoot',
    );
  }
  return context;
};

export const InjuryTimeDisplayProvider: React.FC<{
  children: ReactNode;
  injuryTimeDisplay: string;
  setInjuryTimeDisplay: React.Dispatch<React.SetStateAction<string>>;
}> = ({ children, injuryTimeDisplay, setInjuryTimeDisplay }) => {
  return (
    <InjuryTimeDisplayContext.Provider
      value={{ injuryTimeDisplay, setInjuryTimeDisplay }}
    >
      {children}
    </InjuryTimeDisplayContext.Provider>
  );
};
