import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Dashboard.module.scss';
import calcImage from '../../resources/images/calculators.svg';
import Card from '../../components/Card/Card';
import UserInfo from './UserInfo/UserInfo';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import ActivityPanel from '../../components/ActivityPanel/ActivityPanel';
import Loader from '../../components/Loader/Loader';

class Dashboard extends React.Component<any, any> {
  _isMounted: boolean;

  constructor(props: any) {
    super(props);

    this._isMounted = false;
    this.state = {
      brewLogPage: 1,
      numToShow: 20,
      brewLog: [],
      brewActivity: [],
      brewsNum: 0,
      loading: false,
    }
  }

  async listUserBrews() {
    try {
      this.setState({loading: true});
      this.props.loadUser();
      const authHeaders = {'authorization': this.props.currentUser ? this.props.currentUser.token : null};
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/brews/dashboard/?num=${this.state.numToShow}`, {
        headers: authHeaders,
      }).then(result => {
        this._isMounted && this.setState({
          brewLog: result.data.allBrews,
          brewActivity: result.data.brews,
          brewsNum: result.data.allBrews.length,
          loading: false
        });
      });
    } catch (error) {
      this._isMounted && this.setState({error: error.response.status, loading: false});
    }
  }

  componentDidMount() {
    document.title = "BeerForge | Dashboard";
    this._isMounted = true;
    this._isMounted && this.listUserBrews();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleBrewClick = (brewId: number) => (event: any) => {
    this.props.history.push(`brew/${brewId}`);
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
        } else {
          return null;
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
          <UserInfo user={this.props.currentUser} brewsNum={this.state.brewsNum} />
          <Link
            to="brew"
            className="button button--large button--yellow"
          >New Brew</Link>
        </div>
        <div className={styles.leftColumn}>
          <Card>
            <h2 className={styles.dashboard__label}>Brew Log</h2>
            <List customClass={`${styles.brewLog} ${styles['page' + this.state.brewLogPage]}`}>
              {this.state.loading ? <Loader className={styles.brewLogLoader} /> : brewLogItems}
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
              <Link to="/brews">All Brews</Link>
            </div>
          </Card>
        </div>
        <div className={styles.rightColumn}>
          <Card>
            <h2 className={styles.dashboard__label}>Weekly Activity</h2>
            {this.state.loading ? <Loader className={styles.activityLoader} /> : <ActivityPanel brews={this.state.brewActivity} />}
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