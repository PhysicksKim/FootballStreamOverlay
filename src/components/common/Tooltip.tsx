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
  timeout?: number;
  color?: 'error' | 'success';
}

const Tooltip: React.FC<TooltipProps> = ({
  show,
  message,
  className,
  position,
  align = 'left',
  timeout = 3000,
  color = 'error',
}) => {
  return (
    <CSSTransition
      in={show}
      timeout={timeout}
      classNames='tooltip'
      unmountOnExit
    >
      <div className={`tooltip ${position} ${align} ${color}`}>{message}</div>
    </CSSTransition>
  );
};

export default Tooltip;
