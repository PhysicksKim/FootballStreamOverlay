import React, { useEffect, useRef, useState } from 'react';
import '../styles/ScoreBoard.scss';

interface ScoreBoardProps {
  teamA?: string;
  teamB?: string;
  scoreA?: number;
  scoreB?: number;
}
const ScoreBoard: React.FC<ScoreBoardProps> = ({
  teamA = '맨유',
  teamB = '맨티',
  scoreA = 3,
  scoreB = 1,
}) => {
  const teamARef = useRef<HTMLDivElement>(null);
  const teamBRef = useRef<HTMLDivElement>(null);
  const [teamAFontSize, setTeamAFontSize] = useState(40);
  const [teamBFontSize, setTeamBFontSize] = useState(40);

  const adjustFontSize = (
    teamRef: React.RefObject<HTMLDivElement>,
    setFontSize: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const MAX_WIDTH = 250; // 예시로 설정한 최대 너비
    if (teamRef.current) {
      let fontSize = 40; // 초기 폰트 크기
      while (teamRef.current.scrollWidth > MAX_WIDTH && fontSize > 10) {
        fontSize--;
        teamRef.current.style.fontSize = `${fontSize}px`;
      }
      setFontSize(fontSize);
    }
  };

  useEffect(() => {
    adjustFontSize(teamARef, setTeamAFontSize);
    adjustFontSize(teamBRef, setTeamBFontSize);
  }, [teamA, teamB]);

  return (
    <div className='score-board-container'>
      <div className='score-board-wrapper'>
        <div className='team-section team-a'>
          <div>{teamA}</div>
          <div>{scoreA}</div>
        </div>
        <div className='team-section team-b'>
          <div>{scoreB}</div>
          <div>{teamB}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
