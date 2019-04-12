import React, { ComponentState } from 'react';

import styles from './Header.module.scss';
import logoImage from '../../resources/images/beerforge_logo.svg';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { props } from 'bluebird';
import Avatar from '../Avatar/Avatar';

interface Props extends RouteComponentProps {
  user?: any;
  onLogout: Function;
}

function Header({
  user,
  onLogout
}: Props) {
  return(
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <img src={logoImage} alt="BeerForge - Modern homebrewing" />
      </Link>
      {
        location.pathname !== '/login' && !user ?
          <Link to="/login" className={styles.loginLink}>Log In</Link>
          : null
      }
      {
        user ?
          <div title={user.username} className={styles.header__user}>
            <Avatar currentUser={true} />
          </div>
          : null
      }
    </header>
  );
};

export default withRouter(Header);