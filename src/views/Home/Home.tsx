import React from 'react';

import styles from './Home.module.scss';

class Home extends React.Component<any, any> {
  componentDidMount() {
    document.title = 'BeerForge';
  }

  render() {
    return (
      <section className={styles.home}></section>
    );
  }
}

export default Home;