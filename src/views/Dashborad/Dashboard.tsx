import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Dashboard.module.scss';
import calcImage from '../../resources/images/calculators.svg';
import coinsImage from '../../resources/images/coins.svg';
import Card from '../../components/Card/Card';
import UserInfo from './UserInfo/UserInfo';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import ActivityPanel from '../../components/ActivityPanel/ActivityPanel';
import Loader from '../../components/Loader/Loader';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { useUser } from '../../Store/UserContext';
import { useSnackbar } from '../../Store/SnackbarContext';
import { useModal } from '../../Store/ModalContext';

// @ts-ignore
const form = <div className={styles.formWrapper}><script src="https://donorbox.org/widget.js" paypalexpress="false"></script><p>Help me keep the servers running, or just buy me a beer!</p><iframe title="donate" allowpaymentrequest="" frameBorder="0" height="750px" name="donorbox" scrolling="no" seamless="seamless" src="https://donorbox.org/embed/keep-the-servers-on-or-buy-me-a-beer-1" style={{"maxWidth": "500px", "minWidth": "310px", "maxHeight": "none !important"}} width="100%"></iframe></div>;

const Dashboard = (props: any) => {
  // CONTEXT
  const [user, userDispatch] = useUser();
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();

  // STATE
  const [brewLogPage, setBrewLogPage] = useState(1);
  // eslint-disable-next-line
  const [snackbar, snackbarDispatch] = useSnackbar();
  // eslint-disable-next-line
  const [numToShow, setNumToShow] = useState(20);
  const [brewLog, setBrewLog] = useState([]);
  const [brewActivity, setBrewActivity] = useState([]);
  const [brewsNum, setBrewsNum] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMounted: any = useRef();
  
  const listUserBrews = async () => {
    try {
      setLoading(true);
      userDispatch({type: 'load'});
      const authHeaders = {'authorization': user ? user.token : null};
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/brews/dashboard/?num=${numToShow}`, {
        headers: authHeaders,
      }).then(result => {
        if (isMounted) {
          setBrewLog(result.data.allBrews);
          setBrewActivity(result.data.brews);
          setBrewsNum(result.data.allBrews.length)
          setLoading(false);
        }
      });
    } catch (error) {
      if (isMounted) {
        snackbarDispatch({type: 'show', payload: {
          status: 'error',
          message: error.message,
        }});
        setLoading(false);
      }
    }
  }

  // mount
  useEffect(() => {
    document.title = "BeerForge | Dashboard";
    isMounted.current = true;
    isMounted && listUserBrews();

    scrollToTop(400);

    // unmount
    return function cleanup() {
      isMounted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBrewClick = (brewId: number) => (event: any) => {
    props.history.push(`brew/${brewId}`);
  }

  const togglePage = (page: number) => (event: any) => {
    setBrewLogPage(page);
    scrollToTop(400);
  }

  const handleDonateClick = (event: any) => {
    event.stopPropagation();
    modalDispatch({
      type: 'show',
      payload: {
        classOverride: styles.donate,
        title: `DONATE TO BEERFORGE`,
        body: form,
      },
    });
  }

  const brewLogItems = brewLog.length > 0
    ? brewLog.map((brew: any, index: number) => {
        if (index <= 19) {
          return (
            <ListItem
              key={brew.id}
              customClass={styles.brewLog__item}
              data={index < 10 ? 'page1' : 'page2'}
              clicked={handleBrewClick(brew.id)}
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
        <UserInfo user={user} brewsNum={brewsNum} />
        <Link
          to="brew"
          className="button button--large button--yellow"
        >New Brew</Link>
      </div>
      <div className={styles.leftColumn}>
        <Card>
          <h2 className={styles.dashboard__label}>Brew Log</h2>
          <List customClass={`${styles.brewLog} ${styles['page' + brewLogPage]}`}>
            {loading ? <Loader className={styles.brewLogLoader} /> : brewLogItems}
          </List>
          <div className={styles.brewLog__footer}>
              <div>
                <button
                  className={`button button--page ${brewLogPage === 1 ? 'on' : ''}`}
                  onClick={togglePage(1)}
                >1</button>
                {brewLog.length > 10 ?
                  <button
                    className={`button button--page ${brewLogPage === 2 ? 'on' : ''}`}
                    onClick={togglePage(2)}
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
          {loading ? <Loader className={styles.activityLoader} /> : <ActivityPanel brews={brewActivity} />}
        </Card>
        <Card customClass={styles.flex}>
          <Link to="/calculators" className={styles.cardLink}>
            <h2 className={styles.dashboard__header}>Calculators</h2>
            <img src={calcImage} alt="calculators" />
          </Link>
        </Card>
        <Card customClass={styles.flex}>
          <button
            className={styles.cardLink}
            onClick={handleDonateClick}
          >
            <h2 className={styles.dashboard__header}>Donate</h2>
            <img src={coinsImage} alt="calculators" />
          </button>
        </Card>
      </div>
    </section>
  );
}

export default Dashboard;