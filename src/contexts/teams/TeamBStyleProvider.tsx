import React, { createContext, useContext, useState } from 'react';
import { TeamStyles } from '@src/types/types';

type TeamStyleContextType = {
  teamBStyle: TeamStyles;
  updateTeamBStyle: <T extends keyof TeamStyles>(
    type: T,
    value: TeamStyles[T],
  ) => void;
};

const TeamBStyleContext = createContext({} as TeamStyleContextType);

/**
 *
 * @returns TeamBStyleContext { teamBStyle, updateTeamBStyle }
 */
export const useTeamBStyle = () => useContext(TeamBStyleContext);

export const TeamBStyleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [teamBStyle, setTeamBStyle] = useState<TeamStyles>({
    fontColor: 'white',
    fontWeight: 'normal',
  });

  const updateTeamBStyle: TeamStyleContextType['updateTeamBStyle'] = (
    type,
    value,
  ) => {
    setTeamBStyle((prevStyles) => ({ ...prevStyles, [type]: value }));
  };

  return (
    <TeamBStyleContext.Provider value={{ teamBStyle, updateTeamBStyle }}>
      {children}
    </TeamBStyleContext.Provider>
  );
};
