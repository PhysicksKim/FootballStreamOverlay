import React from 'react';
import '@styles/board/MatchNameBoard.scss';
// import gyeFootball from '@assets/images/gye_football.png';
import gyeMancity from '@assets/images/gye_mancity.png';

const MatchNameBoard: React.FC<{ matchName: string }> = ({ matchName }) => {
  return (
    <div className='match-name-board-container'>
      <div className='match-name-board-flex'>
        <p className='match-name-box'>
          {/* <img src={gyeHead} className='gye-image gye-head' /> */}
          {/* <img src={gyeFootball} className='gye-image gye-football' /> */}
          <img src={gyeMancity} className='gye-image gye-mancity' />
          {matchName}
        </p>
      </div>
    </div>
  );
};

export default MatchNameBoard;
