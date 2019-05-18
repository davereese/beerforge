import React from 'react';

import styles from './Card.module.scss';

interface Props {
  color?: 'dashboard' | 'brew';
  customClass?: string;
  customStyle?: {},
  children?: any;
}

function Card({
  color,
  customClass,
  customStyle,
  children
}: Props) {
  return(
    <div
      className={`${styles.card} ${customClass} ${styles[color ? color : 'dashboard']}`}
      style={customStyle}
    >
      {children}
    </div>
  );
};

export default Card;