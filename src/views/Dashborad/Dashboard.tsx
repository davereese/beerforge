import React from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';

import styles from './Dashboard.module.scss';
import Card from '../../components/Card/Card';
import UserInfo from './UserInfo/UserInfo';

interface Props extends RouteComponentProps {
  user: {
    username: string;
    firstname: string;
    lastname: string;
    beers: number;
    badges: number;
  };
}

class Dashboard extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    document.title = "BeerForge | Dashboard";
  }

  render() {
    return (
      <section className={styles.dashboard}>
        {this.props.user ? // check for the user object first
          <>
            <div className={styles.topRow}>
              <UserInfo user={this.props.user} />
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
          </>
          : <Redirect to="/" />
        }
      </section>
    );
  }
}

export default Dashboard;
