import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import { pen } from '../../resources/javascript/penSvg.js';
import FormHandler from './FormHandler/FormHandler';
import { BrewInterface } from '../../Store/BrewProvider';

interface Props extends RouteComponentProps {
  brew: BrewInterface;
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

  closeSidebar = () => {
    this.setState({sideBarOpen: false});
    window.setTimeout(() => {this.setState({form: null})}, 500);
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

  transformNotes = () => {
    if (this.props.brew.notes) {
      return {__html: this.props.brew.notes.replace(/\n/g, '<br>')};
    }
  }

  parseStringValues = (string: string | undefined) => {
    if (typeof string !== 'string') { return ''};
    let newString = string.charAt(0).toUpperCase() + string.slice(1)
    return newString.replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  render() {
    const {brew, updateBrew} = this.props;

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
                    {brew.name === '' ? 'New Brew' : brew.name}
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
                    value={brew.name}
                    ref={this.nameInput}
                    onChange={(e) => updateBrew({name: e.currentTarget.value})}
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
                  Brew Method: {this.parseStringValues(brew.batchType)}
                  <button
                    className={`button button--link ${styles.edit}`}
                    onClick={this.openSideBar('settings')}
                  >{pen}</button>
                </li>
                <li>
                  Batch Size: {brew.batchSize ? `${brew.batchSize} gal` : null}
                  <button
                    className={`button button--link ${styles.edit}`}
                    onClick={this.openSideBar('settings')}
                  >{pen}</button>
                </li>
                <li>
                  System Efficiency: {brew.systemEfficiency ? `${brew.systemEfficiency}%` : null}
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
                <span>Mash at <strong>149° F</strong></span> */}
                <span>{brew.strikeTemp
                  ? <>Strike with <strong>XX gal</strong> at <strong>{brew.strikeTemp}° F</strong></>
                  : null}
                </span>
                <span>
                  {brew.mashLength ? <>Mash for <strong>{brew.mashLength} min</strong></> : null}
                </span>
                <span></span>
                <span>
                  {brew.spargeTemp ? <>Sparge with <strong>XX gal</strong> at <strong>{brew.spargeTemp}° F</strong></> : null}
                </span>
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
                <span>{brew.boilLength ? <>Boil Time: <strong>{brew.boilLength} min</strong></> : null}</span>
                {/* <span>Boil Size: <strong>7.5 gal</strong></span> */}
                <span></span>
                <span></span>
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
                <span>
                  {brew.primaryLength ? <>Primary Length: <strong>{brew.primaryLength} days</strong></> : null}
                  {brew.secondaryLength ? <><br />Secondary Length: <strong>{brew.secondaryLength} days</strong></> : null}
                </span>
                <span>
                  {brew.primaryTemp ? <>Temp: <strong>{brew.primaryTemp}° F</strong></> : null}
                  {brew.secondaryTemp ? <><br />Temp: <strong>{brew.secondaryTemp}° F</strong></> : null}
                </span>
                <span></span>
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
                <span>{brew.packagingType && brew.carbonationMethod
                  ? <strong>{this.parseStringValues(brew.packagingType)}/{this.parseStringValues(brew.carbonationMethod)}</strong>
                  : null}
                </span>
                <span>{brew.co2VolumeTarget ? <>CO2 Vol: <strong>{brew.co2VolumeTarget}</strong></> : null}</span>
                <span>{brew.beerTemp ? <>Temp: <strong>{brew.beerTemp}° F</strong></> : null}</span>
                <span>{brew.amountForCO2
                  ? <>Pressure: <strong>{brew.amountForCO2} {brew.packagingType === 'kegged' ? 'psi' : 'oz'}</strong></>
                  : null}
                </span>
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
                {this.props.brew.notes
                  ? <div dangerouslySetInnerHTML={this.transformNotes()} />
                  : null
                }
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
            <FormHandler
              {...this.props}
              form={this.state.form}
              nextForm={this.nextForm}
              closeSidebar={this.closeSidebar}
            />
          </Card>
        </div>
      </section>
    );
  }
}

export default Brew;