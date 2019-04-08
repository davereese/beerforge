import React from 'react';

import styles from './Dashboard.module.scss';
import Card from '../../components/Card/Card';

class Dashboard extends React.Component {
  render() {
    return (
      <div className={styles.dashboard}>
        <div className={styles.leftColumn}>
          <Card>Brew List</Card>
        </div>
        <div className={styles.rightColumn}>
          <Card>Activity</Card>
          <Card>Calculators</Card>
        </div>
      </div>
    );
  }
}

export default Dashboard;
