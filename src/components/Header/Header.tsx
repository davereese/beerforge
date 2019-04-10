import React, { ComponentState } from 'react';

import styles from './Header.module.scss';
import logoImage from '../../resources/images/beerforge_logo.svg';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { props } from 'bluebird';

class Header extends React.Component<RouteComponentProps, ComponentState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {}
  }

  render() {
    return(
      <header className={styles.header}>
        <Link to="/" className={styles.logoLink}>
          <img src={logoImage} alt="BeerForge - Modern homebrewing" />
        </Link>
        {
          this.props.location.pathname !== '/login' ?
            <Link to="/login" className={styles.loginLink}>Log In</Link>
            : null
        }
      </header>
    );
  }
};

export default withRouter(Header);