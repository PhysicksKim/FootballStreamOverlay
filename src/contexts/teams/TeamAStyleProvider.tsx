import React, { createContext, useContext, useState } from 'react';

type Styles = {
  fontColor: 'white' | 'black';
  fontWeight: 'normal' | 'bold';
};

type TeamStyleContextType = {
  teamAStyle: Styles;
  updateTeamAStyle: <T extends keyof Styles>(type: T, value: Styles[T]) => void;
};

const TeamAStyleContext = createContext({} as TeamStyleContextType);

export const useTeamAStyle = () => useContext(TeamAStyleContext);

export const TeamAStyleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [teamAStyle, setTeamAStyle] = useState<Styles>({
    fontColor: 'white',
    fontWeight: 'normal',
  });

  const updateTeamAStyle: TeamStyleContextType['updateTeamAStyle'] = (
    type,
    value,
  ) => {
    setTeamAStyle((prevStyles) => ({ ...prevStyles, [type]: value }));
  };

  return (
    <TeamAStyleContext.Provider value={{ teamAStyle, updateTeamAStyle }}>
      {children}
    </TeamAStyleContext.Provider>
  );
};
