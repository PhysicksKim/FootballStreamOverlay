import React, { createContext, useContext, useState } from 'react';
import { Team } from '@src/types/types';
import CountryCodes from '@src/classes/team/AsiancupCodes';
import EPL2324Codes from '@src/classes/team/EPLCodes';

const TeamAContext = createContext(
  {} as {
    teamA: Team;
    updateTeamA: <K extends keyof Team>(key: K, value: Team[K]) => void;
  },
);

export const useTeamA = () => useContext(TeamAContext);

export const TeamAProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const teamAInitialValue: Team = {
    category: 'epl2324',
    code: EPL2324Codes.맨시티.code,
    name: EPL2324Codes.맨시티.name,
    score: 0,
    uniform: 'home',
  };

  const [teamA, setTeamA] = useState<Team>(teamAInitialValue);

  const updateTeamA = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamA((prevTeam: Team) => ({ ...prevTeam, [key]: value }));
  };
  return (
    <TeamAContext.Provider value={{ teamA, updateTeamA }}>
      {children}
    </TeamAContext.Provider>
  );
};
