import React, { useEffect, useRef } from "react";

import styles from './Snackbar.module.scss';
import { useSnackbar } from '../../Store/SnackbarContext';


function Snackbar() {
  const [snackbar, snackbarDispatch] = useSnackbar();
  const { message, status, closing } = snackbar;
  const timeout: any = useRef();

  useEffect(() => {
    if (snackbar.show === true && snackbar.closing === false) {
      clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        snackbarDispatch({type: 'hide'});
      }, 2550);
    }
    if (snackbar.closing === true) {
      window.setTimeout(() => {
        snackbarDispatch({type: 'close'});
      }, 550);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snackbar]);

  return snackbar.show ? (
    <div className={`${styles.snackbar} ${styles[status]} ${closing ? styles.close : null}`}>
      {message}
    </div>
  ) : null;
}

export default Snackbar;