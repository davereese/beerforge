import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './NoMatch.module.scss';

const NoMatch = () => {
  useEffect(() => {
    document.title = "BeerForge | 404 - Not Found";
  }, []);

  return (
    <section className={styles.noMatch}>
      <h1 className={`h2 ${styles.header}`}>404</h1>
      <h2 className="h1">At least we don't have to dump any beer because of this.</h2>
      <p>Not sure what happened here, but you can always head back to the dashboard, or of course, brew beer.</p>
      <p>
        <Link
          to="dashboard"
          className="button button--large button--red"
        >Dashboard</Link>
        <Link
          to="brew"
          className="button button--large button--yellow"
        >New Brew</Link></p>
    </section>
  );
}

export default NoMatch;