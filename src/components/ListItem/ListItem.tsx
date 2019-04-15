import React from 'react';

import styles from './ListItem.module.scss';

interface Props {
  clicked: any;
  data?: string;
  label?: string;
  color?: 'dashboard' | 'brew';
  customClass?: string;
  children?: any;
}

function ListItem({
  color,
  customClass,
  children,
  clicked,
  label,
  data,
}: Props) {
  return(
    <li
      className={`${styles.listItem} ${customClass} ${styles[color ? color : 'dashboard']}`}
      tabIndex={-1}
      onClick={clicked}
      aria-label={label}
      data-custom={data}
    >
      {children}
    </li>
  );
};

export default ListItem;