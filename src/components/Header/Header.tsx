import React from "react";

import styles from "./Header.module.scss";
import logoImage from "../../resources/images/beerforge_logo.svg";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";

function Header({ currentUser, logOutUser }: any) {
  return (
    <header className={styles.header}>
      <Link to={!currentUser ? "/" : "/dashboard"} className={styles.logoLink}>
        <img src={logoImage} alt="BeerForge - Modern homebrewing" />
      </Link>
      {window.location.pathname !== "/login" && !currentUser ? (
        <Link to="/login" className={styles.loginLink}>
          Log In
        </Link>
      ) : null}
      {window.location.pathname !== "/dashboard"
        && window.location.pathname !== "/profile"
        && currentUser ? (
        <div title={currentUser.username} className={styles.header__user}>
          <Avatar currentUser={true} />
        </div>
      ) : null}
      {(window.location.pathname === "/dashboard"
        || window.location.pathname === "/profile")
        && currentUser ? (
        <button className={`button button--link ${styles.loginLink}`} onClick={logOutUser}>
          Log Out
        </button>
      ) : null}
    </header>
  );
}

export default Header;
