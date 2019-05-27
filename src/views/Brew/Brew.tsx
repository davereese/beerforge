import React, { RefObject } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import { pen } from '../../resources/javascript/penSvg.js';
import FormSelector from './FormSelector/FormSelector';
import { brew } from '../../Store/BrewProvider';

interface Props extends RouteComponentProps {
  brew: brew;
  updateBrew: Function;
}

class Brew extends React.Component<Props, any> {
  private brewContainer = React.createRef<HTMLDivElement>();
  private nameInput = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      sideBarOpen: false,
      editingName: false,
      topSpacing: 0,
      form: '',
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (event: Event) => {
    // @ts-ignore-line
    const rect = this.brewContainer.current.getBoundingClientRect();
    if (rect.top < -30) {
      this.setState({topSpacing: (rect.top * -1) - 30});
    } else if (rect.top > -30 && rect.top < 0) {
      this.setState({topSpacing: (rect.top * -1) + rect.top});
    } else if (rect.top < 0) {
      this.setState({topSpacing: 0});
    }
  }

  openSideBar = (choice: string | null = null) => (event: any) => {
    if (!this.state.sideBarOpen) {
      this.setState({sideBarOpen: !this.state.sideBarOpen});
    }
    this.setState({form: choice});
  }

  nextForm = (event: any) => {
    const formOrder = [
      'settings', 'fermentables', 'hops', 'yeast', 'mash',
      'boil', 'fermentation', 'packaging', 'notes'];
    const position = formOrder.indexOf(this.state.form);
    if (position < formOrder.length -1) {
      this.setState({form: formOrder[position + 1]});
    }
  }

  render() {
    const top = {
      marginTop: this.state.topSpacing
    };

    return (
      <section
        className={`
          ${styles.brew}
          ${this.state.sideBarOpen ? styles.open : ''}
        `}
        ref={this.brewContainer}
      >
        <div className={styles.mainContent} role="main">
          <div className={styles.brew__pageHeading}>
            <h1>
              {!this.state.editingName
                ? <>
                    {this.props.brew.name === '' ? 'New Brew' : this.props.brew.name}
                    <button
                      className={`button button--link ${styles.edit}`}
                      onClick={() =>
                        this.setState({editingName: true}, () => {
                          this.nameInput.current !== null ? this.nameInput.current.focus() : null;
                        })
                      }
                    >{pen}</button>
                  </>
                : <input
                    className={styles.nameInput}
                    value={this.props.brew.name}
                    ref={this.nameInput}
                    onChange={(e) => this.props.updateBrew({name: e.currentTarget.value})}
                    onBlur={() => this.setState({editingName: false})}
                  />
              }
            </h1>
            <button
              className={`button button--link ${styles.settings}`}
              onClick={this.openSideBar('settings')}
            >Settings</button>
          </div>
          {this.props.staticContext}
          <Card color="brew" customClass={styles.new}>
            <div className={styles.brew__numbers}>
              <ul className={styles.brew__numbersList}>
                <li>
                    Brew Method:
                    <button
                      className={`button button--link ${styles.edit}`}
                      onClick={this.openSideBar('settings')}
                    >{pen}</button>
                </li>
                <li>
                  Batch Size:
                  <button
                    className={`button button--link ${styles.edit}`}
                    onClick={this.openSideBar('settings')}
                  >{pen}</button>
                </li>
                <li>
                  System Efficiency:
                  <button
                    className={`button button--link ${styles.edit}`}
                    onClick={this.openSideBar('settings')}
                  >{pen}</button>
                </li>
              </ul>
              <div className={styles.brew__stats}>
                <div className={styles.brew__stat}>
                  <span className={styles.value}></span>
                  <label className={styles.label}>ABV</label>
                </div>
                <div className={styles.brew__stat}>
                  <span className={styles.value}></span>
                  <label className={styles.label}>ATTEN.</label>
                </div>
                <div className={styles.brew__stat}>
                  <span className={styles.value}></span>
                  <label className={styles.label}>IBU</label>
                </div>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>
                    {/* <div
                      className={styles.srmSwatch}
                      style={{backgroundColor: getSrmToRgb(7)}}
                    /> */}
                    
                  </span>
                  <label className={styles.label}>SRM</label>
                </div>
              </div>
            </div>
          </Card>
          <Card color="brew" customClass={`${styles.new} ${styles.brew__editingSection}`}>
            <div className={styles.brew__header}>
              <h2>Fermentables</h2>
              {/* <span>Total: 12.75 lbs</span> */}
              <button
                className={`button button--icon plus ${styles.editButton}`}
                onClick={this.openSideBar('fermentables')}
              ><span>Edit</span></button>
            </div>
            <List customClass={styles.brew__ingredients}>
              {/* <ListItem
                color="brew"
                clicked={() => {}}
              >
                <span>12.75 lbs</span>
                <span>American Two-Row</span>
                <span>1.8 SRM</span>
              </ListItem> */}
            </List>
          </Card>
          <Card color="brew" customClass={`${styles.new} ${styles.brew__editingSection}`}>
            <div className={styles.brew__header}>
              <h2>Hops</h2>
              {/* <span>Total: 1 oz</span> */}
              <button
                className={`button button--icon plus ${styles.editButton}`}
                onClick={this.openSideBar('hops')}
              ><span>Edit</span></button>
            </div>
            <List customClass={styles.brew__ingredients}>
              {/* <ListItem
                color="brew"
                clicked={() => {}}
              >
                <span>1 oz</span>
                <span>Horizon</span>
                <span>13% AA</span>
                <span>60 min</span>
                <span>49.12 IBU</span>
              </ListItem> */}
            </List>
          </Card>
          <Card color="brew" customClass={`${styles.new} ${styles.brew__editingSection}`}>
            <div className={styles.brew__header}>
              <h2>Yeast</h2>
              {/* <span>Cell Count: 200 bn</span> */}
              <button
                className={`button button--icon plus ${styles.editButton}`}
                onClick={this.openSideBar('yeast')}
              ><span>Edit</span></button>
            </div>
            <List customClass={styles.brew__ingredients}>
              {/* <ListItem
                color="brew"
                clicked={() => {}}
              >
                <span>2 packs</span>
                <span>White Labs California Ale WLP001</span>
              </ListItem> */}
            </List>
          </Card>
          <Card color="brew" customClass={styles.new}>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Mash</h2>
                <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={this.openSideBar('mash')}
                ><span>Edit</span></button>
              </div>
              <div className={styles.section__values}>
                {/* <span>Strike with <strong>5.5 gal</strong> at <strong>160° F</strong></span>
                <span>Mash for <strong>90 min</strong></span>
                <span>Mash at <strong>149° F</strong></span>
                <span>Sparge with <strong>8.3 gal</strong> at <strong>168° F</strong></span> */}
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Boil</h2>
                <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={this.openSideBar('boil')}
                ><span>Edit</span></button>
              </div>
              <div className={`${styles.section__values} ${styles.withStats}`}>
                {/* <span>Boil Time: <strong>60 min</strong></span>
                <span>Boil Size: <strong>7.5 gal</strong></span> */}
                <div></div>
                <div className={styles.section__stats}>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}></span>
                    <label className={styles.label}>PRE</label>
                  </div>
                  <span className={styles.arrow}></span>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}></span>
                    <label className={styles.label}>OG</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Fermentation</h2>
                <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={this.openSideBar('fermentation')}
                ><span>Edit</span></button>
              </div>
              <div className={`${styles.section__values} ${styles.withStats}`}>
                <div>
                  {/* <span>Length: <strong>14 days</strong></span> */}
                </div>
                <div>
                  {/* <span>Temp: <strong>65° F</strong></span> */}
                </div>
                <div></div>
                <div className={styles.section__stats}>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}></span>
                    <label className={styles.label}>OG</label>
                  </div>
                  <span className={styles.arrow}></span>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}></span>
                    <label className={styles.label}>FG</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Packaging</h2>
                <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={this.openSideBar('packaging')}
                ><span>Edit</span></button>
              </div>
              <div className={styles.section__values}>
                {/* <span><strong>Kegged/Forced</strong></span>
                <span>CO2 Vol: <strong>2.3</strong></span>
                <span>Temp: <strong>34° F</strong></span>
                <span>Pressure: <strong>7.26 psi</strong></span> */}
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Notes</h2>
                <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={this.openSideBar('notes')}
                ><span>Edit</span></button>
              </div>
              <div className={styles.brew__notes}>
                {/* <p></p> */}
              </div>
            </div>
          </Card>
          <button
            type="submit"
            className={`button button--large ${styles.saveButton}`}
          >Save &amp; Get Brewing!</button>
        </div>
        <div className={styles.sideBar} role="complementary">
          <Card color="brew" customStyle={top} customClass={`${styles.formsContainer}`}>
            <button
              className={`button button--link ${styles.sideBarClose}`}
              onClick={() => this.setState({sideBarOpen: false})}
            >Done</button>
            <FormSelector form={this.state.form} />
            <div className={styles.formsContainer__footer}>
              <button
                className="button button--green button--no-shadow"
                onClick={() => {}}
              >Submit</button>
              <button
                className="button button--brown button--no-shadow"
                onClick={() => this.setState({sideBarOpen: false})}
              >Cancel</button>
              {this.state.form !== 'notes' ?
                <button
                  className="button button--no-shadow"
                  onClick={this.nextForm}
                >Next</button>
              : <br />}
            </div>
          </Card>
        </div>
      </section>
    );
  }
}

export default Brew;