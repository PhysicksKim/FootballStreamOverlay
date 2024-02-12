import React, { createContext, useContext, useEffect, useState } from 'react';
import { Team } from '@src/types/types';
import CountryCodes from '@src/classes/team/AsiancupCodes';
import EPL2324Codes from '@src/classes/team/EPLCodes';

const TeamBContext = createContext(
  {} as {
    teamB: Team;
    updateTeamB: <K extends keyof Team>(key: K, value: Team[K]) => void;
  },
);

export const useTeamB = () => useContext(TeamBContext);

export const TeamBProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const teamBInitialValue: Team = {
    category: 'epl2324',
    code: EPL2324Codes.첼시.code,
    name: EPL2324Codes.첼시.name,
    score: 0,
    uniform: 'home',
  };
  const [teamB, setTeamB] = useState<Team>(teamBInitialValue);

  const updateTeamB = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamB((prevTeam: Team) => ({ ...prevTeam, [key]: value }));
  };

  return (
    <TeamBContext.Provider value={{ teamB, updateTeamB }}>
      {children}
    </TeamBContext.Provider>
  );
};
