import React, { createContext, useContext, useState } from 'react';

type Styles = {
  fontColor: 'white' | 'black';
  fontWeight: 'normal' | 'bold';
};

type TeamStyleContextType = {
  teamBStyle: Styles;
  updateTeamBStyle: <T extends keyof Styles>(type: T, value: Styles[T]) => void;
};

const TeamBStyleContext = createContext({} as TeamStyleContextType);

export const useTeamBStyle = () => useContext(TeamBStyleContext);

export const TeamBStyleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [teamBStyle, setTeamBStyle] = useState<Styles>({
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
