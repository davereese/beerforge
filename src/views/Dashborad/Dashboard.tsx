import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className={styles.topRow}>
          <UserInfo user={this.state.user} />
          <Link
            to="brew"
            className="button button--large button--yellow"
          >New Brew</Link>
        </div>
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
