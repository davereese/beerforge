import React from 'react';

import styles from './Dashboard.module.scss';
import Card from '../../components/Card/Card';
import UserInfo from './UserInfo/UserInfo';

class Dashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        firstName: 'Dave',
        lastName: 'Reese',
        beers: 35,
        badges: 12,
      },
    }
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <div className={styles.leftColumn}>
          <UserInfo user={this.state.user} />
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
