import React from 'react';
import { Team } from '@src/types/types';
import TeamControlPanel from './TeamControlPanel';
import '@styles/control/TeamControlTab.scss';

interface TeamControlTabProps {
  team: Team;
  updateTeam: <K extends keyof Team>(key: K, value: Team[K]) => void;
}

const TeamControlTab: React.FC<TeamControlTabProps> = ({
  team,
  updateTeam,
}) => {
  return (
    <div className='team-control-panel-wrapper'>
      <TeamControlPanel team={team} updateTeam={updateTeam} />
    </div>
  );
};

export default TeamControlTab;
