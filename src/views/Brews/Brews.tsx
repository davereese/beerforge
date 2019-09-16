import React from 'react';
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
import { BrewInterface } from '../../Store/BrewProvider';
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { UserContext } from '../../Store/UserContext';

class Brews extends React.Component<any, any> {
  static contextType = UserContext;

  logHeader: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.state = {
      search: '',
      brews: [],
      brewsCount: 0,
      page: 1,
      numToShow: 20,
      loading: false,
      showTooltip: '',
    }

    this.logHeader = React.createRef<HTMLDivElement>();
  }

  async listUserBrews(page: number) {
    const [user, userDispatch] = this.context;
    try {
      // double check current user hasn't expired
      userDispatch({type: 'load'});
      this.setState({loading: true});
      const authHeaders = {'authorization': user ? user.token : null};
      await axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/brews/?num=${this.state.numToShow}&page=${page}&search=${this.state.search}`, {
        headers: authHeaders,
      }).then(result => {
        this.setState({brews: result.data.brews, brewsCount: result.data.count, page: page, loading: false}, () => scrollToTop(300) );
      });
    } catch (error) {
      this.setState({loading: false});
      this.props.snackbarProps.showSnackbar({
        status: 'error',
        message: error.message,
      });
    }
  }

  export = (brew: BrewInterface) => async (event: any) => {
    const [user, userDispatch] = this.context;
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
      this.props.snackbarProps.showSnackbar({
        status: 'error',
        message: error.message,
      });
    }
  }

  componentDidMount() {
    document.title = "BeerForge | All Brews";
    this.listUserBrews(1);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event: Event) => {
    const rect = this.logHeader.current
      ? this.logHeader.current.getBoundingClientRect()
      : new DOMRect();
    if (this.state.headerClass === null && rect.top > 49) {
      this.setState({
        headerClass: null,
        placeholderClass: {
          height: 0,
          width: 0,
        }
      });
    } else if (this.state.headerClass !== null && rect.top > -20) {
      this.setState({
        headerClass: null,
        placeholderClass: {
          height: 0,
          width: 0,
        }
      });
    } else if (rect.top <= 49) {
      this.setState({
        headerClass: styles.fixedHeader,
        placeholderClass: {
          width: '100%',
          height: '69px'
        }
      });
    }
  }

  handleBrewClick = (brewId: number) => (event: any) => {
    this.props.history.push(`brew/${brewId}`);
  }

  openMoreMenu = (index: number) => (event: any) => {
    event.stopPropagation();
    this.setState({showTooltip: index});
  }

  closeMoreMenu = (index: number) => {
    if (this.state.showTooltip === index) {
      this.setState({showTooltip: ''});
    }
  }

  onChange = debounce((value: string) => {
    this.setState({search: value}, () => this.listUserBrews(1));
  }, 300);

  render() {
    const pagination = Array.from(Array(Math.ceil(this.state.brewsCount/this.state.numToShow)), (e, i) => {
      const page = i+1;
      return <button 
          className={`button button--page ${this.state.page === page ? 'on' : ''}`}
          key={page}
          onClick={() => this.state.page !== page ? this.listUserBrews(page) : null}
        >{page}</button>;
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
            onChange={({ target: { value } }) => this.onChange(value)}
          />
          <Link
            to="brew"
            className="button button--large button--yellow"
          >New Brew</Link>
        </div>
        <div className={`${styles.brewLogHeader} ${this.state.headerClass}`}>
          <label className={styles.nameCol}>Name</label>
          <label>ABV %</label>
          <label>IBU</label>
          <label>SRM</label>
          <label>Date Brewed</label>
        </div>
        <div ref={this.logHeader} style={this.state.placeholderClass} />
        <Card customClass={styles.allBrews__list}>
          <List customClass={styles.brewLog}>
            {this.state.loading && this.state.brews.length === 0 ? <Loader className={styles.loader} />
              : this.state.brews.length > 0
                ? this.state.brews.map((brew: any, index: number) => {
                  return <ListItem
                    key={brew.id}
                    customClass={styles.brewLog__item}
                    clicked={this.handleBrewClick(brew.id)}
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
                      <div className={styles.kebab} onClick={this.openMoreMenu(index)}>
                        <span></span><span></span><span></span>
                      </div>
                      <Tooltip
                        show={this.state.showTooltip === index}
                        placement="left-center"
                        onClose={() => this.closeMoreMenu(index)}
                        className={styles.moreMenu}
                      >
                        <button
                          className={`button button--link button--small ${styles.moreButton}`}
                          onClick={this.export(brew)}
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
}

export default Brews;