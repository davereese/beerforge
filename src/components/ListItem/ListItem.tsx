import React from 'react';

import styles from './ListItem.module.scss';

interface Props {
  clicked: any;
  color?: 'dashboard' | 'brew';
  customClass?: string;
  children?: any;
}

function ListItem({
  color,
  customClass,
  children,
  clicked
}: Props) {
  return(
    <li
      className={`${styles.listItem} ${customClass} ${styles[color ? color : 'dashboard']}`}
      tabIndex={-1}
      onClick={clicked}
    >
      {children}
    </li>
  );
};

export default ListItem;