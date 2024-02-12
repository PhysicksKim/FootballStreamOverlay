import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  TeamFontColor,
  FontColorOptions,
  TeamSelect,
  TeamElement,
} from '@src/types/types';

const TeamFontColorContext = createContext<TeamFontColor | undefined>(
  undefined,
);

export const useTeamFontColor = () => {
  const context = useContext(TeamFontColorContext);
  if (!context) {
    throw new Error(
      'useTeamFontColor must be used within a TeamFontColorProvider',
    );
  }
  return context;
};

export const TeamFontColorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [teamANameColor, setTeamANameColor] =
    useState<FontColorOptions>('default');
  const [teamBNameColor, setTeamBNameColor] =
    useState<FontColorOptions>('default');
  const [teamAScoreColor, setTeamAScoreColor] =
    useState<FontColorOptions>('default');
  const [teamBScoreColor, setTeamBScoreColor] =
    useState<FontColorOptions>('default');

  const updateTeamFontColor: (
    team: TeamSelect,
    element: TeamElement,
    color: FontColorOptions,
  ) => void = (team, element, color) => {
    if (team === 'teamA') {
      if (element === 'name') {
        setTeamANameColor(color);
      } else {
        setTeamAScoreColor(color);
      }
    } else {
      if (element === 'name') {
        setTeamBNameColor(color);
      } else {
        setTeamBScoreColor(color);
      }
    }
  };

  return (
    <TeamFontColorContext.Provider
      value={{
        teamAColor: { name: teamANameColor, score: teamAScoreColor },
        teamBColor: { name: teamBNameColor, score: teamBScoreColor },
        updateTeamFontColor,
      }}
    >
      {children}
    </TeamFontColorContext.Provider>
  );
};
