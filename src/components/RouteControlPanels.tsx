import React from 'react';
import { NavLink } from 'react-router-dom';
import '@styles/RouteControlPanels.scss';

const RouteControlPanels: React.FC<Record<string, never>> = () => {
  return (
    <>
      <div className='control-links-container'>
        <NavLink
          className={({ isActive }) =>
            'timer-link ' + (isActive ? 'active-link' : 'not-active-link')
          }
          to={'/'}
        >
          <div className='link-title'>라이브 전광판</div>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            'teams-link ' + (isActive ? 'active-link' : 'not-active-link')
          }
          to={'/team-a'}
        >
          <div className='link-title'>팀 A</div>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            'teams-link ' + (isActive ? 'active-link' : 'not-active-link')
          }
          to={'/team-b'}
        >
          <div className='link-title'>팀 B</div>
        </NavLink>
      </div>
    </>
  );
};

export default RouteControlPanels;
