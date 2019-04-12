import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Dashboard.module.scss';
import Card from '../../components/Card/Card';
import UserInfo from './UserInfo/UserInfo';

interface Props {
  user: Object;
}

class Dashboard extends React.Component<Props, any> {
  constructor(props: Props) {
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

  componentDidMount() {
    document.title = "BeerForge | Dashboard";
  }

  render() {
    return (
      <section className={styles.dashboard}>
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
      </section>
    );
  }
}

export default Dashboard;
