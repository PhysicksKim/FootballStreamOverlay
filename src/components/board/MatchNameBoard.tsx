import React from 'react';
import '@styles/board/MatchNameBoard.scss';
import gyeFootball from '../../images/gye_football.png';

const MatchNameBoard: React.FC<{ matchName: string }> = ({ matchName }) => {
  return (
    <div className='match-name-board-container'>
      <div className='match-name-board-flex'>
        <p className='match-name-box'>
          {/* <img src={gyeHead} className='gye-image gye-head' /> */}
          <img src={gyeFootball} className='gye-image gye-football' />
          {matchName}
        </p>
      </div>
    </div>
  );
};

export default MatchNameBoard;
