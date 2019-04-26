import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

import styles from './Dashboard.module.scss';
import calcImage from '../../resources/images/calculators.svg';
import Card from '../../components/Card/Card';
import UserInfo from './UserInfo/UserInfo';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import ActivityPanel from '../../components/ActivityPanel/ActivityPanel';

interface Props extends RouteComponentProps {
  user: {
    username: string;
    first_name: string;
    last_name: string;
    beers: number;
    badges: number;
  };
}

class Dashboard extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.state = {
      brewLogPage: 1,
      brewLog: []
    }
  }

  async listUserBrews() {
    try {
      // @ts-ignore-line
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const authHeaders = {'authorization': currentUser ? currentUser.token : null};
      await axios.get('http://localhost:4000/api/brews', {
        headers: authHeaders,
      }).then(result => {
        this.setState({brewLog: result.data});
      });
    } catch (error) {
      this.setState({error: error.response.status});
    }
  }

  componentDidMount() {
    document.title = "BeerForge | Dashboard";
    this.listUserBrews();
  }

  handleBrewClick = (brewId: number) => (event: any) => {
    console.log({brewId});
  }

  togglePage = (page: number) => (event: any) => {
    this.setState({brewLogPage: page});
  }

  render() {
    const brewLogItems = this.state.brewLog.length > 0
      ? this.state.brewLog.map((brew: any, index: number) => {
        if (index <= 19) {
          return (
            <ListItem
              key={brew.id}
              customClass={styles.brewLog__item}
              data={index < 10 ? 'page1' : 'page2'}
              clicked={this.handleBrewClick(brew.id)}
              label="Click to see brew details"
            >
              {brew.name} <span><FormattedDate>{brew.date_brewed}</FormattedDate></span>
            </ListItem>
          );
        }
      })
      : <li className={styles.noBrews}>
          <Link
            to="brew"
            className="button"
          >Get Brewing!</Link>
        </li>
    ;

    return (
      <section className={styles.dashboard}>
        <div className={styles.topRow}>
          <UserInfo user={this.props.user} brews={this.state.brewLog} />
          <Link
            to="brew"
            className="button button--large button--yellow"
          >New Brew</Link>
        </div>
        <div className={styles.leftColumn}>
          <Card>
            <h2 className={styles.dashboard__label}>Brew Log</h2>
            <List customClass={`${styles.brewLog} ${styles['page' + this.state.brewLogPage]}`}>
              {brewLogItems}
            </List>
            <div className={styles.brewLog__footer}>
                <div>
                  <button
                    className={`button button--page ${this.state.brewLogPage === 1 ? 'on' : ''}`}
                    onClick={this.togglePage(1)}
                  >1</button>
                  {brewLogItems.length > 10 ?
                    <button
                      className={`button button--page ${this.state.brewLogPage === 2 ? 'on' : ''}`}
                      onClick={this.togglePage(2)}
                    >2</button>
                    : null
                  }
                </div>
              <Link to="/all-brews">All Brews</Link>
            </div>
          </Card>
        </div>
        <div className={styles.rightColumn}>
          <Card>
            <h2 className={styles.dashboard__label}>Weekly Activity</h2>
            <ActivityPanel brews={this.state.brewLog} />
          </Card>
          <Card customClass={styles.flex}>
            <Link to="/calculators" className={styles.cardLink}>
              <h2 className={styles.dashboard__header}>Calculators</h2>
              <img src={calcImage} alt="calculators" />
            </Link>
          </Card>
        </div>
      </section>
    );
  }
}

export default Dashboard;