import React from "react";

import styles from "./Header.module.scss";
import logoImage from "../../resources/images/beerforge_logo.svg";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import Avatar from "../Avatar/Avatar";

interface Props extends RouteComponentProps {
  user?: any;
  onLogout: () => void;
}

function Header({ user, onLogout }: Props) {
  return (
    <header className={styles.header}>
      <Link to={!user ? "/" : "/dashboard"} className={styles.logoLink}>
        <img src={logoImage} alt="BeerForge - Modern homebrewing" />
      </Link>
      {window.location.pathname !== "/login" && !user ? (
        <Link to="/login" className={styles.loginLink}>
          Log In
        </Link>
      ) : null}
      {window.location.pathname !== "/dashboard" && user ? (
        <div title={user.username} className={styles.header__user}>
          <Avatar currentUser={true} />
        </div>
      ) : null}
      {window.location.pathname === "/dashboard" && user ? (
        <Link to="/" className={styles.loginLink} onClick={onLogout}>
          Log Out
        </Link>
      ) : null}
    </header>
  );
}

export default withRouter(Header);
