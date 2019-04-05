import React from 'react';

import styles from './Header.module.scss';
import logoImage from '../../resources/images/beerforge_logo.svg';
import { Link } from 'react-router-dom';

function Header({}) {
  return(
    <header className={styles.header}>
      <img src={logoImage} alt="BeerForge - Modern homebrewing" />
    </header>
  );
};

export default Header;