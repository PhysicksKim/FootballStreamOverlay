import React from 'react';
import '../../styles/MatchNameBoard.scss';
import gyeHead from '../../images/gye_head.png';

const MatchNameBoard: React.FC<{ matchName: string }> = ({ matchName }) => {
  return (
    <div className='match-name-board-container'>
      <div className='match-name-board-flex'>
        <p className='match-name-box'>
          <img src={gyeHead} className='gye-image' />
          {matchName}
        </p>
      </div>
    </div>
  );
};

export default MatchNameBoard;
