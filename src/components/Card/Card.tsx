import React, { ReactChildren } from 'react';

import styles from './Card.module.scss';

interface Props {
  color?: 'dashboard' | 'brew';
  children?: any;
}

function Card({
  color,
  children
}: Props) {
  return(
    <div className={`${styles.card} ${styles[color ? color : 'dashboard']}`}>
      {children}
    </div>
  );
};

export default Card;