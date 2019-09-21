import React, { useState, useEffect, CSSProperties, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce'

import styles from './Brews.module.scss';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import Tooltip from "../../components/Tooltip/Tooltip";
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { BrewInterface } from '../../Store/BrewContext';
import { useUser } from '../../Store/UserContext';
import { useSnackbar } from '../../Store/SnackbarContext';

const Brews = (props: any) => {
  // CONTEXT
  const [user, userDispatch] = useUser();
  // eslint-disable-next-line
  const [snackbar, snackbarDispatch] = useSnackbar();

  // STATE
  const [search, setSearch] = useState('');
  const [brews, setBrews] = useState([]);
  const [brewsCount, setBrewsCount] = useState(0);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line
  const [numToShow, setNumToShow] = useState(20);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState<null | number>(null);
  // const [headerClass, setHeaderClass] = useState<null | string>(null);
  const [placeholderClass, setPlaceholderClass] = useState<undefined | CSSProperties>(undefined);

  // REFS
  // const logHeader = React.createRef<HTMLDivElement>();
  const logHeader = useRef<HTMLDivElement>(null);
  const headerClass = useRef('');

  // mount
  useEffect(() => {
    document.title = "BeerForge | All Brews";
    listUserBrews(1);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // unmount
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listUserBrews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const listUserBrews = async (page: number) => {
    try {
      // double check current user hasn't expired
      userDispatch({type: 'load'});
      setLoading(true);
      const authHeaders = {'authorization': user ? user.token : null};
      await axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/brews/?num=${numToShow}&page=${page}&search=${search}`, {
          headers: authHeaders,
        }).then(result => {
          setBrews(result.data.brews);
          setBrewsCount(result.data.count);
          setPage(page);
          setLoading(false);
        }).then(() => {
          scrollToTop(300);
        });
    } catch (error) {
      setLoading(false);
      snackbarDispatch({type: 'show', payload: {
        status: 'error',
        message: error.message,
      }});
    }
  };

  const exportBrew = (brew: BrewInterface) => async (event: any) => {
    event.stopPropagation();
    try {
      userDispatch({type: 'load'});
      const authHeaders = {'authorization': user ? user.token : null};
      await axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/brews/export/?brews=${brew.id}`, {
        headers: authHeaders,
        responseType: 'blob',
      }).then(result => {
        const downloadUrl = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `beerforge_export-${brew.name ? brew.name.replace(' ', '_') : ''}.xml`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    } catch (error) {
      snackbarDispatch({type: 'show', payload: {
        status: 'error',
        message: error.message,
      }});
    }
  }

  const handleScroll = (event: Event) => {
    // @ts-ignore-line
    const rect = logHeader.current
      ? logHeader.current.getBoundingClientRect()
      : new DOMRect();
    if (headerClass.current === '' && rect.top > 49) {
      // setHeaderClass(null);
      // @ts-ignore-line
      headerClass.current = '';
      setPlaceholderClass({
        height: 0,
        width: 0,
      });
    } else if (headerClass.current !== '' && rect.top > -20) {
      // setHeaderClass(null);
      headerClass.current = '';
      setPlaceholderClass({
        height: 0,
        width: 0,
      });
    } else if (rect.top <= 49) {
      // setHeaderClass(styles.fixedHeader);
      headerClass.current = styles.fixedHeader;
      setPlaceholderClass({
        width: '100%',
        height: '69px'
      });
    }
  }

  const handleBrewClick = (brewId: number) => (event: any) => {
    props.history.push(`brew/${brewId}`);
  }

  const openMoreMenu = (index: number) => (event: any) => {
    event.stopPropagation();
    setShowTooltip(index);
  }

  const closeMoreMenu = (index: number) => {
    if (showTooltip === index) {
      setShowTooltip(null);
    }
  }

  const onChange = debounce((value: string) => {
    setSearch(value);
  }, 300);

  const pagination = Array.from(Array(Math.ceil(brewsCount/numToShow)), (e, i) => {
    const currentPage = i+1;
    return <button 
        className={`button button--page ${page === currentPage ? 'on' : ''}`}
        key={currentPage}
        onClick={() => page !== currentPage ? listUserBrews(currentPage) : null}
      >{currentPage}</button>;
  });

  return (
    <section className={styles.allBrews}>
      <div className={styles.topRow}>
        <h1 className={styles.allBrews__header}>All Brews</h1>
        <input
          type="text"
          name="search"
          className={styles.search}
          placeholder="Search brew names"
          onChange={({ target: { value } }) => onChange(value)}
        />
        <Link
          to="brew"
          className="button button--large button--yellow"
        >New Brew</Link>
      </div>
      <div className={`${styles.brewLogHeader} ${headerClass.current}`}>
        <label className={styles.nameCol}>Name</label>
        <label>ABV %</label>
        <label>IBU</label>
        <label>SRM</label>
        <label>Date Brewed</label>
      </div>
      <div ref={logHeader} style={placeholderClass} />
      <Card customClass={styles.allBrews__list}>
        <List customClass={styles.brewLog}>
          {loading && brews.length === 0 ? <Loader className={styles.loader} />
            : brews.length > 0
              ? brews.map((brew: any, index: number) => {
                return <ListItem
                  key={brew.id}
                  customClass={styles.brewLog__item}
                  clicked={handleBrewClick(brew.id)}
                  label="Click to see brew details"
                >
                  <div className={styles.nameCol}>{brew.name}</div>
                  <span className={styles.abvCol}>{brew.abv ? brew.abv : '--'}</span>
                  <span className={styles.ibuCol}>{brew.ibu ? brew.ibu : '--'}</span>
                  <span className={styles.srmCol}>
                    {brew.srm
                      ? <>
                          <div
                            className={styles.srmSwatch}
                            style={{backgroundColor: getSrmToRgb(brew.srm)}}
                          />
                          {brew.srm}
                        </>
                      : '--'}
                  </span>
                  <span className={styles.dateCol}><FormattedDate>{brew.date_brewed}</FormattedDate></span>
                  <div className={styles.moreMenuWrapper}>
                    <div className={styles.kebab} onClick={openMoreMenu(index)}>
                      <span></span><span></span><span></span>
                    </div>
                    <Tooltip
                      show={showTooltip === index}
                      placement="left-center"
                      onClose={() => closeMoreMenu(index)}
                      className={styles.moreMenu}
                    >
                      <button
                        className={`button button--link button--small ${styles.moreButton}`}
                        onClick={exportBrew(brew)}
                      >Export</button>
                    </Tooltip>
                  </div>
                </ListItem>
              })
              : <li className={styles.noBrews}>
                  <Link
                    to="brew"
                    className={`button ${styles.brewLInk}`}
                  >Get Brewing!</Link>
                </li>
          }
        </List>
      </Card>
      <div className={styles.brewLogPages}>
        {pagination}
      </div>
    </section>
  );
}

export default Brews;