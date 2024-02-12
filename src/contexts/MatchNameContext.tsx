import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MatchNameContextProps {
  matchName: string;
  updateMatchName: (matchName: string) => void;
}

const MatchNameContext = createContext<MatchNameContextProps | undefined>(
  undefined,
);

/**
 * { matchName, updateMatchName }
 * @returns MatchNameContextProps : { matchName, updateMatchName }
 */
export const useMatchName = () => {
  const context = useContext(MatchNameContext);
  if (!context) {
    throw new Error('useMatchName must be used within a MatchNameProvider');
  }
  return context;
};

export const MatchNameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [matchName, setMatchName] = useState<string>('EPL 23-24 시즌');

  const updateMatchName = (matchName: string) => {
    setMatchName(matchName);
  };

  return (
    <MatchNameContext.Provider value={{ matchName, updateMatchName }}>
      {children}
    </MatchNameContext.Provider>
  );
};
