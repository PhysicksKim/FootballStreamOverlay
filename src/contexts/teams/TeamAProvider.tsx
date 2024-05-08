import React, { createContext, useContext, useEffect, useState } from 'react';
import { Team } from '@src/types/types';
import { defaultTeamA } from '@src/classes/team/DefaultScoreBoardValue';

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
  const teamAInitialValue: Team = defaultTeamA;
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
