import React from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';

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

    // TEMP STATE
    this.state = {
      brewLogPage: 1,
      brewLog: [
        {id: 11, num: 37, name: 'Düsseldorf Altbier', date: '2019-04-12 22:59:27.595', srm: 10},
        {id: 10, num: 36, name: 'BeerForge IPA', date: '2019-04-06 22:59:27.595', srm: 7},
        {id: 9, num: 35, name: 'Protection Spells', date: '2019-04-01 22:59:27.595', srm: 11},
        {id: 8, num: 34, name: 'Mango Pale Ale', date: '2019-03-10 22:59:27.595', srm: 6},
        {id: 7, num: 33, name: 'Gluen Free Pale Ale', date: '2019-02-21 22:59:27.595', srm: 3},
        {id: 6, num: 32, name: 'Hazy Little Thing', date: '2019-01-01 22:59:27.595', srm: 7},
        {id: 5, num: 31, name: 'Saison DuPont', date: '2018-12-11 22:59:27.595', srm: 2},
        {id: 4, num: 30, name: '90 Shilling', date: '2018-10-09 22:59:27.595', srm: 16},
        {id: 3, num: 29, name: 'Sea Quench', date: '2018-09-14 22:59:27.595', srm: 3},
        {id: 2, num: 28, name: 'Goze', date: '2018-07-20 22:59:27.595', srm: 3},
        {id: 1, num: 27, name: 'Pale Ale', date: '2018-04-06 22:59:27.595', srm: 5},
      ]
    }
  }

  componentDidMount() {
    document.title = "BeerForge | Dashboard";
  }

  handleBrewClick = (brewId: number) => (event: any) => {
    console.log({brewId});
  }

  togglePage = (page: number) => (event: any) => {
    this.setState({brewLogPage: page});
  }

  render() {
    const brewLogItems = this.state.brewLog.map((brew: any, index: number) => {
      return (
        <ListItem
          key={brew.id}
          customClass={styles.brewLog__item}
          data={index < 10 ? 'page1' : 'page2'}
          clicked={this.handleBrewClick(brew.id)}
          label="Click to see brew details"
        >
          {brew.name} <span><FormattedDate>{brew.date}</FormattedDate></span>
        </ListItem>
      );
    });

    return (
      <section className={styles.dashboard}>
        <div className={styles.topRow}>
          <UserInfo user={this.props.user} />
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
              {brewLogItems.length > 10 ?
                <div>
                  <button
                    className={`button button--page ${this.state.brewLogPage === 1 ? 'on' : ''}`}
                    onClick={this.togglePage(1)}
                  >1</button>
                  <button
                    className={`button button--page ${this.state.brewLogPage === 2 ? 'on' : ''}`}
                    onClick={this.togglePage(2)}
                  >2</button>
                </div>
                : null
              }
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
