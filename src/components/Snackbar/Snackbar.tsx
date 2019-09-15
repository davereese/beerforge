import React from "react";

import styles from './Snackbar.module.scss';

interface Props {
  snackbarProps: {
    message: string;
    status: 'error' | 'success' | 'warning';
    show: boolean;
    closing: boolean;
  }
}

function Snackbar({snackbarProps}: Props) {
  const { message, status, closing } = snackbarProps;

  return snackbarProps && snackbarProps.show ? (
    <div className={`${styles.snackbar} ${styles[status]} ${closing ? styles.close : null}`}>
      {message}
    </div>
  ) : null;
}

export default Snackbar;