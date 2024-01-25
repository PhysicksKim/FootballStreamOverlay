import React, { createContext, useContext, useEffect, useState } from 'react';
import { Team, UniformEnum } from '@src/types/types';
import CountryCodes from '@src/classes/team/AsiancupCodes';

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
    category: 'asiancup',
    code: CountryCodes.대한민국.code,
    name: '대한민국',
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
