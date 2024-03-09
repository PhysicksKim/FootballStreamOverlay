// Tooltip.js
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '@styles/common/Tooltip.scss'; // 툴팁 스타일을 위한 CSS 파일

export interface TooltipProps {
  show: boolean;
  message: string;
  className?: string;
  position?: 'top' | 'bottom';
  align?: 'left' | 'center';
}

const Tooltip: React.FC<TooltipProps> = ({
  show,
  message,
  className,
  position,
  align = 'left',
}) => {
  return (
    <CSSTransition in={show} timeout={3000} classNames='tooltip' unmountOnExit>
      <div className={`tooltip ${position} ${align}`}>{message}</div>
    </CSSTransition>
  );
};

export default Tooltip;
