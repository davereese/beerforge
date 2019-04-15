import React from 'react';

import styles from './List.module.scss';

interface Props {
  customClass?: string;
  children?: any;
}

function List({
  customClass,
  children
}: Props) {
  return(
    <ul className={`${styles.list} ${customClass}`}>
      {children}
    </ul>
  );
};

export default List;