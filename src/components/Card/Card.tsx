import React from 'react';

import styles from './Card.module.scss';

interface Props {
  color?: 'dashboard' | 'brew';
  customClass?: string;
  children?: any;
}

function Card({
  color,
  customClass,
  children
}: Props) {
  return(
    <div className={`${styles.card} ${customClass} ${styles[color ? color : 'dashboard']}`}>
      {children}
    </div>
  );
};

export default Card;