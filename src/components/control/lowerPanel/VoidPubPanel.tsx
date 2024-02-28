import React from 'react';

import '@styles/control/lowerPanel/VoidPubPanel.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

const VoidPubPanel: React.FC<Record<string, never>> = () => {
  return (
    <div className='void-pub-box-container'>
      <div className='void-pub-box-wrapper'>
        <div className='void-pub-title'>춘식 타이머 - 문의</div>
        <div className='github-box'>
          <div className='github-mark'>
            <FontAwesomeIcon icon={faGithub} />
          </div>
          <div className='github-name'>PhysicksKim</div>
        </div>
        <div className='gmail-box'>
          <div className='gmail-mark'>
            <FontAwesomeIcon icon={faGoogle} />
          </div>
          <div className='gmail-email'>physickskim@gmail.com</div>
        </div>
      </div>
    </div>
  );
};

export default VoidPubPanel;
