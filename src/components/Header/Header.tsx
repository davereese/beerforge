import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import styles from "./Header.module.scss";
import logoImage from "../../resources/images/beerforge_logo.svg";
import Avatar from "../Avatar/Avatar";
import Tooltip from "../Tooltip/Tooltip";
import { useUser } from '../../Store/UserContext';

const Header = ({ history }: any) => {
  const [user, userDispatch] = useUser();
  const [showTooltip, setTooltip] = useState(false);

  const logOut = (e: any) => {
    setTooltip(false);
    userDispatch({type: 'logout'});
  }

  const goToProfile = (e: any) => {
    setTooltip(false);
    history.push('/profile')
  }

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
      {window.location.pathname !== "/profile" && user ? (
        <div title={user.username} className={styles.header__user}>
          <div className={styles.avatar} onClick={() => setTooltip(true)}>
            <Avatar user={user} />
          </div>
          <Tooltip
            show={showTooltip}
            placement="bottom-right"
            onClose={() => setTooltip(false)}
            className={styles.userMenu}
          >
            <>
              <h2 className={styles.userMenu__header}>{user.username}</h2>
              <div className={styles.userMenu__buttons}>
                <button
                  className="button button--small button--green button--no-shadow"
                  onClick={goToProfile}
                >
                  Profile
                </button>
                <button
                  className="button button--small button--yellow button--no-shadow"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </div>
            </>
          </Tooltip>
        </div>
      ) : null}
      {window.location.pathname === "/profile" && user ? (
        <button
          className={`button button--link ${styles.loginLink}`}
          onClick={() => userDispatch({type: 'logout'})}
        >
          Log Out
        </button>
      ) : null}
    </header>
  );
}

export default withRouter(Header);
