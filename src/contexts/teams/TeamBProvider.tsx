import React, { createContext, useContext, useEffect, useState } from 'react';
import { Team } from '@src/types/types';
import { defaultTeamB } from '@src/classes/team/DefaultScoreBoardValue';

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
  const teamBInitialValue: Team = defaultTeamB;
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
