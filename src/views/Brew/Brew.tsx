import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormHandler from './FormHandler/FormHandler';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import { BrewInterface, FermentableInterface, HopInterface, YeastInterface } from '../../Store/BrewProvider';
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { pen } from '../../resources/javascript/penSvg.js';
import { UserInterface } from '../../Store/UserProvider';
import { ModalProviderInterface } from '../../Store/ModalProvider';
import { isEmpty } from '../../resources/javascript/isEmpty';
import Loader from '../../components/Loader/Loader';

interface Props extends RouteComponentProps {
  currentUser: UserInterface;
  loadUser: Function;
  updateUser: Function;
  saveUser: Function;
  logOutUser: Function;
  brew: BrewInterface;
  clearBrew: Function;
  getBrewfromDB: Function;
  saveBrewToDB: Function;
  updateBrew: Function;
  updateBrewOnDB: Function;
  deleteBrewFromDB: Function;
  history: any;
  modalProps: ModalProviderInterface;
}

class Brew extends React.Component<any, any> {
  brewContainer: React.RefObject<HTMLDivElement>;
  nameInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      new: true,
      readOnly: false,
      sideBarOpen: false,
      editingName: false,
      topSpacing: 0,
      form: '',
      editingData: null,
      loading: false,
      saving: false,
    }
    this.brewContainer = React.createRef<HTMLDivElement>();
    this.nameInput = React.createRef<HTMLInputElement>();
  }

  componentDidMount() {
    document.title = "BeerForge | New Brew";
    // before we start using the current user, let's just make sure they haven't expired, shall we?
    this.props.loadUser();
    const brewId = Number(window.location.pathname.split('/')[2]);
    if (!isNaN(brewId)) {
      this.setState({loading: true});
      this.props.getBrewfromDB(brewId)
        .then(() => {
          const {brew} = this.props;
          const readOnly = brew.userId !== this.props.currentUser.id ? true : false;
          this.setState({
            new: false,
            readOnly: readOnly,
            loading: false
          }, () => document.title = `BeerForge | Viewing ${brew.name}`);
        }, (error: any) => {
          this.setState({loading: false});
          if (isEmpty(this.props.currentUser)) {
            this.props.history.push('/');
          } else {
            this.props.history.push('/dashboard');
          }
        });
    }

    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.brew !== prevProps.brew) {
      // if the brew has changed, reset some stuff
      this.setState({editingData: null});
    }
    if (prevProps.brew.id && !this.props.brew.id) {
      // if we had a brew with an id, and all of a sudden we don't, we must
      // have deleted it. Redirect to the dashboard.
      this.props.history.push('/dashboard');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.props.clearBrew();
  }

  handleScroll = (event: Event) => {
    const rect = this.brewContainer.current
      ? this.brewContainer.current.getBoundingClientRect()
      : new DOMRect();
    if (rect.top < -30) {
      this.setState({topSpacing: (rect.top * -1) - 30});
    } else if (rect.top > -30 && rect.top < 0) {
      this.setState({topSpacing: (rect.top * -1) + rect.top});
    } else if (rect.top < 0) {
      this.setState({topSpacing: 0});
    }
  }

  openSideBar = (choice: string | null = null, editingData: any | null = null) => (event: any) => {
    if (!this.state.sideBarOpen) {
      this.setState({sideBarOpen: !this.state.sideBarOpen});
    }
    this.setState({form: choice, editingData: editingData});
  }

  closeSidebar = () => {
    this.setState({sideBarOpen: false});
    window.setTimeout(() => {this.setState({form: null, editingData: null})}, 500);
  }

  nextForm = (event: any) => {
    const formOrder = [
      'settings', 'fermentables', 'hops', 'yeast', 'mash',
      'boil', 'fermentation', 'packaging', 'notes'];
    if (this.props.brew.batchType && this.props.brew.batchType === 'extract') {
      formOrder.splice(4, 1);
    }
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

  handleSave = (e: any) => {
    // double check current user hasn't expired
    this.props.loadUser();
    this.setState({saving: true});
    this.state.new
      ? this.props.saveBrewToDB()
        .then(() => {
          const {brew} = this.props;
          this.setState({
            new: false,
            readOnly: false,
            saving: false
          });
          this.props.history.push(`/brew/${brew.id}`);
          scrollToTop(300);
        }, (error: any) => {
          this.setState({saving: false});
          console.log(error);
        })
      : this.props.updateBrewOnDB()
        .then(() => {
          this.setState({saving: false});
          scrollToTop(300);
        }, (error: any) => {
          this.setState({saving: false});
          console.log(error);
        });
  }

  render() {
    const {brew, updateBrew} = this.props;

    const top = {
      marginTop: this.state.topSpacing
    };

    return this.state.loading ? <Loader className={styles.loader} color="#000" /> : (
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
                    {!this.state.readOnly
                      ? <button
                          className={`button button--link ${styles.edit}`}
                          onClick={() => {
                            this.setState(
                              {editingName: true},
                              () => this.nameInput.current !== null ? this.nameInput.current.focus() : null
                            )
                          }}
                        >{pen}</button>
                      : null}
                  </>
                : <input
                    className={styles.nameInput}
                    value={brew.name}
                    ref={this.nameInput}
                    onChange={(e) => updateBrew({...brew, name: e.currentTarget.value})}
                    onBlur={() => this.setState({editingName: false})}
                  />
              }
            </h1>
            <span>
              {!this.state.readOnly
                ? <button
                    className={`button button--link ${styles.settings}`}
                    onClick={this.openSideBar('settings')}
                  >Settings</button>
                : null}
              {!this.state.new && brew.dateBrewed
                ? <FormattedDate className={styles.dateBrewed}>{brew.dateBrewed}</FormattedDate>
                : null}
            </span>
          </div>
          {this.props.staticContext}
          <Card color="brew" customClass={this.state.new ? styles.new : styles.view}>
            <div className={styles.brew__numbers}>
              <ul className={styles.brew__numbersList}>
                <li>
                  Brew Method: {this.parseStringValues(brew.batchType)}
                  {!this.state.readOnly
                    ? <button
                        className={`button button--link ${styles.edit}`}
                        onClick={this.openSideBar('settings')}
                      >{pen}</button>
                    : null}
                </li>
                <li>
                  Batch Size: {brew.batchSize ? `${brew.batchSize} gal` : null}
                  {!this.state.readOnly
                    ? <button
                        className={`button button--link ${styles.edit}`}
                        onClick={this.openSideBar('settings')}
                      >{pen}</button>
                    : null}
                </li>
                <li>
                  System Efficiency: {brew.systemEfficiency ? `${brew.systemEfficiency}%` : null}
                  {!this.state.readOnly
                    ? <button
                        className={`button button--link ${styles.edit}`}
                        onClick={this.openSideBar('settings')}
                      >{pen}</button>
                    : null}
                </li>
              </ul>
              <div className={styles.brew__stats}>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>{brew.alcoholContent ? `${brew.alcoholContent}%` : null}</span>
                  <label className={styles.label}>ABV</label>
                </div>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>{brew.attenuation ? `${brew.attenuation}%` : null}</span>
                  <label className={styles.label}>ATTEN</label>
                </div>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>{brew.ibu}</span>
                  <label className={styles.label}>IBU</label>
                </div>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>
                    {brew.srm
                      ? <>
                          <div
                            className={styles.srmSwatch}
                            style={{backgroundColor: getSrmToRgb(brew.srm)}}
                          />
                          {brew.srm}
                        </>
                      : null }
                  </span>
                  <label className={styles.label}>SRM</label>
                </div>
              </div>
            </div>
          </Card>
          <Card color="brew" customClass={`${this.state.new ? styles.new : styles.view} ${styles.brew__editingSection}`}>
            <div className={styles.brew__header}>
              <h2>Fermentables</h2>
              {brew.fermentables.length > 0
                ? <span>Total: {brew.totalFermentables} lbs</span>
                : null}
              {!this.state.readOnly
                ? <button
                    className={`button button--icon plus ${styles.editButton}`}
                    onClick={this.openSideBar('fermentables')}
                  ><span>Edit</span></button>
                : null}
            </div>
            <List customClass={styles.brew__ingredients}>
              {brew.fermentables.map((fermentable: FermentableInterface, index: number) => (
                <ListItem
                  color="brew"
                  clicked={!this.state.readOnly ? this.openSideBar('fermentables', fermentable) : null}
                  key={`${fermentable.id}${index}`}
                >
                  <span>{fermentable.weight} lb{fermentable.weight && fermentable.weight > 1 ? 's' : null}</span>
                  <span>{fermentable.name}</span>
                  <span>{fermentable.lovibond} °L</span>
                </ListItem>
              ))}
            </List>
          </Card>
          <Card color="brew" customClass={`${this.state.new ? styles.new : styles.view} ${styles.brew__editingSection}`}>
            <div className={styles.brew__header}>
              <h2>Hops</h2>
              <span>{brew.hops.length > 0
                ? <>Total: {brew.totalHops} oz</>
                : null}
              </span>
              {!this.state.readOnly
                ? <button
                    className={`button button--icon plus ${styles.editButton}`}
                    onClick={this.openSideBar('hops')}
                  ><span>Edit</span></button>
                : null}
            </div>
            <List customClass={styles.brew__ingredients}>
              {brew.hops.map((hop: HopInterface, index: number) => (
                <ListItem
                  color="brew"
                  clicked={!this.state.readOnly ? this.openSideBar('hops', hop) : null}
                  key={`${hop.id}${index}`}
                >
                  <span>{hop.weight} oz</span>
                  <span>{hop.name}</span>
                  <span>{hop.alphaAcid}% AA</span>
                  <span>{hop.lengthInBoil} min</span>
                  <span>{hop.ibu ? <>{hop.ibu} IBU</> : null}</span>
                </ListItem>
              ))}
            </List>
          </Card>
          <Card color="brew" customClass={`${this.state.new ? styles.new : styles.view} ${styles.brew__editingSection}`}>
            <div className={styles.brew__header}>
              <h2>Yeast</h2>
              {brew.yeast.length > 0
                ? <span>{brew.pitchCellCount} bn cells {brew.targetPitchingCellCount
                    ? <>of {brew.targetPitchingCellCount} bn target</>
                    : null}
                  </span>
                : null}
              {!this.state.readOnly
                ? <button
                    className={`button button--icon plus ${styles.editButton}`}
                    onClick={this.openSideBar('yeast')}
                  ><span>Edit</span></button>
                : null}
            </div>
            <List customClass={`${styles.brew__ingredients} ${styles.yeast}`}>
              {brew.yeast.map((item: YeastInterface, index: number) => (
                <ListItem
                  color="brew"
                  clicked={!this.state.readOnly ? this.openSideBar('yeast', item) : null}
                  key={`${item.id}${index}`}
                >
                  <span>{item.amount} pack{item.amount && item.amount > 1 ? 's' : null}</span>
                  <span>{item.manufacturer} - {item.name}</span>
                  <span>{item.averageAttenuation}% average attenuation</span>
                </ListItem>
              ))}
            </List>
          </Card>
          <Card color="brew" customClass={this.state.new ? styles.new : styles.view}>
            {brew.batchType !== 'extract'
              ? <>
                <div className={styles.brew__section}>
                  <div className={styles.brew__header}>
                    <h2>Mash</h2>
                    <span>{brew.batchType === 'BIAB' &&
                      brew.totalMashVolume &&
                      brew.kettleSize &&
                      Number(brew.totalMashVolume) > Number(brew.kettleSize)
                        ? <>Warning: Total mash volume exceeds kettle size</>
                        : null}
                    </span>
                    {!this.state.readOnly
                      ? <button
                          className={`button button--icon pen ${styles.editButton}`}
                          onClick={this.openSideBar('mash')}
                        ><span>Edit</span></button>
                      : null}
                  </div>
                  <div className={styles.section__values}>
                    <span>
                      {brew.strikeVolume && brew.batchType !== 'BIAB' && brew.strikeTemp
                        ? <>Strike with <strong>{brew.strikeVolume} gal</strong> at <strong>{brew.strikeTemp}° F</strong></>
                        : null}
                      {brew.totalWater && brew.batchType === 'BIAB' && brew.strikeTemp
                        ? <>Strike with <strong>{brew.totalWater.toFixed(2)} gal</strong> at <strong>{brew.strikeTemp}° F</strong></>
                        : null}
                    </span>
                    <span>
                      {brew.mashLength
                        ? <>Mash for <strong>{brew.mashLength} min</strong></>
                        : null}
                    </span>
                    <span>
                      {brew.targetMashTemp
                        ? <>Mash at <strong>{brew.targetMashTemp}° F</strong></>
                        : null}
                    </span>
                    <span>
                      {brew.batchType !== 'BIAB' && brew.spargeTemp
                        ? <>Sparge&nbsp;
                          {brew.spargeVolume
                            ? <>with <strong>{brew.spargeVolume} gal</strong> </>
                            : null}
                          at <strong>{brew.spargeTemp}° F</strong></>
                        : null}
                      {brew.totalMashVolume && brew.batchType === 'BIAB'
                        ? <>Total Mash Vol: <strong>{brew.totalMashVolume} gal</strong></>
                        : null}
                    </span>
                  </div>
                </div>
                </>
              : null}
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Boil</h2>
                {!this.state.readOnly
                  ? <button
                      className={`button button--icon pen ${styles.editButton}`}
                      onClick={this.openSideBar('boil')}
                    ><span>Edit</span></button>
                  : null}
              </div>
              <div className={`${styles.section__values} ${styles.withStats}`}>
                {brew.batchType === 'partialMash' && brew.preBoilVolume && brew.spargeVolume
                  ? <span>Top off with <strong>
                      {brew.topOff} gal
                    </strong></span>
                  : null}
                <span>{brew.preBoilVolume
                  ? <>Boil Vol: <strong>{brew.preBoilVolume} gal</strong></>
                  : null}</span>
                <span>{brew.boilLength
                  ? <>Boil Time: <strong>{brew.boilLength} min</strong></>
                  : null}</span>
                {brew.batchType !== 'partialMash'
                  ? <span></span>
                  : null}
                <div className={styles.section__stats}>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}>{brew.preBoilG}</span>
                    <label className={styles.label}>PRE</label>
                  </div>
                  <span className={styles.arrow}></span>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}>{brew.og}</span>
                    <label className={styles.label}>OG</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Fermentation</h2>
                {!this.state.readOnly
                  ? <button
                      className={`button button--icon pen ${styles.editButton}`}
                      onClick={this.openSideBar('fermentation')}
                    ><span>Edit</span></button>
                  : null}
              </div>
              <div className={`${styles.section__values} ${styles.withStats}`}>
                <span>
                  {brew.primaryLength
                    ? <>Primary Length: <strong>{brew.primaryLength} days</strong></>
                    : null}
                  {brew.secondaryLength
                    ? <><br />Secondary Length: <strong>{brew.secondaryLength} days</strong></>
                    : null}
                </span>
                <span>
                  {brew.primaryTemp
                    ? <>Temp: <strong>{brew.primaryTemp}° F</strong></>
                    : null}
                  {brew.secondaryTemp
                    ? <><br />Temp: <strong>{brew.secondaryTemp}° F</strong></>
                    : null}
                </span>
                <span></span>
                <div className={styles.section__stats}>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}>{brew.og}</span>
                    <label className={styles.label}>OG</label>
                  </div>
                  <span className={styles.arrow}></span>
                  <div className={styles.brew__stat}>
                    <span className={styles.value}>{brew.fg}</span>
                    <label className={styles.label}>FG</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Packaging</h2>
                {!this.state.readOnly
                  ? <button
                      className={`button button--icon pen ${styles.editButton}`}
                      onClick={this.openSideBar('packaging')}
                    ><span>Edit</span></button>
                  : null}
              </div>
              <div className={styles.section__values}>
                <span>{brew.packagingType && brew.carbonationMethod
                  ? <strong>{this.parseStringValues(brew.packagingType)}/{this.parseStringValues(brew.carbonationMethod)}</strong>
                  : null}
                </span>
                <span>{brew.CO2VolumeTarget
                  ? <>CO<sub>2</sub> Vol: <strong>{brew.CO2VolumeTarget}</strong></>
                  : null}</span>
                <span>{brew.beerTemp
                  ? <>Temp: <strong>{brew.beerTemp}° F</strong></>
                  : null}</span>
                <span>{brew.amountForCO2
                  ? <>{brew.carbonationMethod === 'forced' ? 'Pressure: ' : 'Amount: '}
                  <strong>{brew.amountForCO2} {brew.carbonationMethod === 'forced' ? 'psi' : 'oz'}</strong></>
                  : null}
                </span>
              </div>
            </div>
            <div className={styles.brew__section}>
              <div className={styles.brew__header}>
                <h2>Notes</h2>
                {!this.state.readOnly
                  ? <button
                      className={`button button--icon pen ${styles.editButton}`}
                      onClick={this.openSideBar('notes')}
                    ><span>Edit</span></button>
                  : null}
              </div>
              <div className={styles.brew__notes}>
                {this.props.brew.notes
                  ? <div dangerouslySetInnerHTML={this.transformNotes()} />
                  : null
                }
              </div>
            </div>
          </Card>
          {!this.state.readOnly
            ? <button
                type="submit"
                className={`button button--large ${styles.saveButton} ${this.state.saving ? styles.saving : null}`}
                onClick={this.handleSave}
              >
                {this.state.new ? <>Save &amp; Get Brewing!</> : <>Update Brew</>}
                {this.state.saving ? <Loader className={styles.savingLoader} /> : null}
              </button>
            : null}
        </div>
        <div className={styles.sideBar} role="complementary">
          <Card color="brew" customStyle={top} customClass={`${styles.formsContainer}`}>
            <FormHandler
              {...this.props as Props}
              form={this.state.form}
              nextForm={this.nextForm}
              editingData={this.state.editingData}
              closeSidebar={this.closeSidebar}
            />
          </Card>
        </div>
      </section>
    );
  }
}

export default Brew;