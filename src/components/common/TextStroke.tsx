import React from 'react';
import './TextStroke.scss';

interface TextStrokeProps {
  tag: keyof JSX.IntrinsicElements;
  text: string;
  type: 'outside' | 'inside';
  className?: string;
  style?: React.CSSProperties;
}

const TextStroke: React.FC<TextStrokeProps> = ({
  tag: Tag, // 태그 종류 (예: 'h2', 'div', 'p')
  text,
  type,
  className,
  style,
}) => {
  const combinedClassName = `${type} ${className || ''}`;

  return (
    <Tag className={combinedClassName} data-text={text} style={style}>
      {text}
    </Tag>
  );
};

export default TextStroke;
