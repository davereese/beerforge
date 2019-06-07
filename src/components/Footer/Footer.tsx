import React from 'react';

import styles from './Footer.module.scss';

const year = new Date().getFullYear();

function Footer() {
  return(
    <footer className={styles.footer}>
      <p>&copy; Copyright {year} - BeerForge</p>
    </footer>
  );
};

export default Footer;