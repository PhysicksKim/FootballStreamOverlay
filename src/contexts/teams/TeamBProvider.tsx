import React, { createContext, useContext, useEffect, useState } from 'react';
import { Team } from '@src/types/types';
import CountryCodes from '@src/classes/team/AsiancupCodes';

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
    category: 'asiancup',
    code: CountryCodes.말레이시아.code,
    name: '말레이시아',
    score: 0,
    uniform: 'away',
  };
  const [teamB, setTeamB] = useState<Team>(teamBInitialValue);

  useEffect(() => {
    console.log('teamA', teamB);
  }, [teamB]);

  const updateTeamB = <K extends keyof Team>(key: K, value: Team[K]) => {
    setTeamB((prevTeam: Team) => ({ ...prevTeam, [key]: value }));
  };

  return (
    <TeamBContext.Provider value={{ teamB, updateTeamB }}>
      {children}
    </TeamBContext.Provider>
  );
};
