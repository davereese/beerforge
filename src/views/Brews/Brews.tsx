import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import styles from './Brews.module.scss';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Card from '../../components/Card/Card';
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import Loader from '../../components/Loader/Loader';

class Brews extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      brews: [],
      page: 1,
      numToShow: 20,
      loading: false,
    }
  }

  async listUserBrews(page: number) {
    try {
      this.setState({loading: true});
      this.props.loadUser();
      const authHeaders = {'authorization': this.props.currentUser ? this.props.currentUser.token : null};
      await axios.get(`http://localhost:4000/api/brews/${this.state.numToShow}/page/${page}`, {
        headers: authHeaders,
      }).then(result => {
        this.setState({brews: result.data, page: page, loading: false}, () => {
          scrollToTop(300);
          });
      });
    } catch (error) {
      this.setState({error: error.response.status, loading: false});
    }
  }

  componentDidMount() {
    document.title = "BeerForge | All Brews";
    this.listUserBrews(1);
  }

  handleBrewClick = (brewId: number) => (event: any) => {
    this.props.history.push(`brew/${brewId}`);
  }

  render() {
    const pagination = Array.from(Array(Math.ceil(this.props.currentUser.brewCount/this.state.numToShow)), (e, i) => {
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
          <Link
            to="brew"
            className="button button--large button--yellow"
          >New Brew</Link>
        </div>
        <div className={styles.brewLogHeader}>
          <label className={styles.nameCol}>Name</label>
          <label>ABV %</label>
          <label>IBU</label>
          <label>SRM</label>
          <label>Date Brewed</label>
        </div>
        <Card customClass={styles.allBrews__list}>
          <List customClass={styles.brewLog}>
            {this.state.loading ? <Loader className={styles.loader} />
              : this.state.brews.length > 0
                ? this.state.brews.map((brew: any, index: number) => {
                  return <ListItem
                    key={brew.id}
                    customClass={styles.brewLog__item}
                    clicked={this.handleBrewClick(brew.id)}
                    label="Click to see brew details"
                  >
                    <div className={styles.nameCol}>{brew.name}</div>
                    <span>{brew.abv ? brew.abv : '--'}</span>
                    <span>{brew.ibu ? brew.ibu : '--'}</span>
                    <span>
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
                    <span><FormattedDate>{brew.date_brewed}</FormattedDate></span>
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