import React, { createContext, useContext, useState } from 'react';
import { TeamStyles } from '@src/types/types';

type TeamStyleContextType = {
  teamAStyle: TeamStyles;
  updateTeamAStyle: <T extends keyof TeamStyles>(
    type: T,
    value: TeamStyles[T],
  ) => void;
};

const TeamAStyleContext = createContext({} as TeamStyleContextType);

export const useTeamAStyle = () => useContext(TeamAStyleContext);

export const TeamAStyleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [teamAStyle, setTeamAStyle] = useState<TeamStyles>({
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
