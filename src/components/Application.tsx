import React from 'react';
import '../styles/Application.scss';
import TimerRoot from './TimerRoot';

import { FontProvider, useFont } from '@src/contexts/FontContext';
import GlobalStyle from '@src/components/styledcomponents/GlobalStyle';
import { FontEnum } from '@src/classes/FontEnum';

const Application: React.FC = () => {
  return (
    <FontProvider>
      <TimerRoot />
    </FontProvider>
  );
};

export default Application;
