import React, { useState, useEffect, useRef } from 'react';
import { Prompt } from 'react-router'
import { RouteComponentProps } from 'react-router-dom';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';
import FormHandler from './FormHandler/FormHandler';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';
import {
  BrewInterface,
  FermentableInterface,
  HopInterface,
  YeastInterface,
  AdjunctInterface,
  MashInterface
} from '../../Store/BrewContext';
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { pen } from '../../resources/javascript/penSvg.js';
import { isEmpty } from '../../resources/javascript/isEmpty';
import { usePrevious } from '../../resources/javascript/usePreviousHook';
import { useUser } from '../../Store/UserContext';
import { useBrew, processOptionsInterface } from '../../Store/BrewContext';
import { useModal } from '../../Store/ModalContext';
import { useSnackbar } from '../../Store/SnackbarContext';
import * as brewService from '../../Store/BrewService';
import { lb2kg, gal2l, oz2g, f2c, qt2l } from '../../resources/javascript/calculator';

interface Props extends RouteComponentProps {
  history: any;
}

const Brew = (props: Props) => {
  // CONTEXT
  const [user, userDispatch] = useUser();
  const [brew, brewDispatch] = useBrew();
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();
  // eslint-disable-next-line
  const [snackbar, snackbarDispatch] = useSnackbar();

  // STATE
  const [newBrew, setNewBrew] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [topSpacing, setTopSpacing] = useState(0);
  const [form, setForm] = useState('');
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shoudlBlock, setShoudlBlock] = useState(false);

  // REFS
  const brewContainer = useRef<HTMLDivElement>(null);
  const formContainer = useRef<HTMLDivElement>(null);

  const top = {marginTop: topSpacing};
  const prevBrew: BrewInterface = usePrevious(brew) as unknown as BrewInterface;
  const unitLabels = {
    vol: user.units === 'metric' ? 'L' : 'gal',
    smallVol: user.units === 'metric' ? 'L' : 'qts',
    largeWeight: user.units === 'metric' ? 'kg' : 'lb',
    smallWeight: user.units === 'metric' ? 'g' : 'oz',
    temp: user.units === 'metric' ? 'C' : 'F',
  }
  const userSettings: processOptionsInterface = {
    ibuFormula: user.ibu_formula,
    units: user.units,
    strikeFactor: user.strike_adjustment,
    kettle: user.kettle_size,
    evapRate: user.evap_rate,
    trubLoss: user.trub_loss,
    equipmentLoss: user.equipment_loss,
    absorptionRate: user.absorption_rate,
    hopAbsorptionRate: user.hop_absorption_rate
  }

  // mount
  useEffect(() => {
    document.title = "BeerForge | New Brew";
    window.addEventListener('scroll', handleScroll, { passive: true });
    scrollToTop(0);

    const getBrew = async (brewId: number) => {
      setLoading(true);
      await brewService.getBrew(brewId, user)
        .then((res: any) => {
          setLoading(false);
          setNewBrew(false);
          brewDispatch({
            type: 'process',
            payload: res.data.brew,
            options: userSettings
          });
          return res;
        })
        .catch((error) => {
          snackbarDispatch({type: 'show', payload: {
            status: 'error',
            message: error.message,
          }});
          if (isEmpty(user)) {
            props.history.push('/');
          } else {
            props.history.push('/dashboard');
          }
        });
    }

    // before we start using the current user, let's just make
    // sure they haven't expired, shall we?
    userDispatch({type: 'load'});
    const brewId = Number(window.location.pathname.split('/')[2]);
    if (!isNaN(brewId)) {
      getBrew(brewId);
    }

    // unmount
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll);
      brewDispatch({type: 'clear'});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update
  useEffect(() => {
    if (brew.id) {
      const readOnly = brew.userId !== user.id ? true : false;
      document.title = `BeerForge | Viewing ${brew.name}`;
      setNewBrew(false);
      setReadOnly(readOnly);
    }

    setEditingData(null);

    if (prevBrew && prevBrew.id && !brew.id) {
      // if we had a brew with an id, and all of a sudden we don't, we must
      // have deleted it. Redirect to the dashboard.
      props.history.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brew]);

  // editingData callback
  useEffect(() => {
    const sideBarMode = formContainer.current
      ? window.getComputedStyle(formContainer.current).position
      : 'relative';
    if (editingData !== null) {
      if (sideBarMode === "fixed") {
        openModalForm();
      } else {
        if (!sideBarOpen) {
          setSideBarOpen(!sideBarOpen);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingData]);

  // setForm callback
  useEffect(() => {
    const sideBarMode = formContainer.current
      ? window.getComputedStyle(formContainer.current).position
      : 'relative';
    if (form !== '') {
      if (sideBarMode === "fixed") {
        openModalForm();
      } else {
        if (!sideBarOpen) {
          setSideBarOpen(!sideBarOpen);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Watch changes for prompt display
  useEffect(() => {
    if (newBrew && shoudlBlock) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  });

  const openSideBar = (
    choice: string = '',
    editingData: any | null = null
  ) => (event: any) => {
    setForm(choice);
    setEditingData(editingData);
  };

  const closeSidebar = () => {
    const sideBarMode = formContainer.current
      ? window.getComputedStyle(formContainer.current).position
      : "fixed";
    if (sideBarMode === 'fixed') {
      modalDispatch({type: 'hide'});
    } else {
      setSideBarOpen(false);
    }
    window.setTimeout(() => {
      setForm('');
      setEditingData(null);
    }, 500);
  };

  const openModalForm = () => {
    modalDispatch({
      type: 'show',
      payload: {
        node:
          <FormHandler
            form={form}
            nextForm={nextForm}
            editingData={editingData}
            closeSidebar={closeSidebar}
            updateBrew={handleUpdateBrew}
            deleteBrew={handleDeleteBrew}
            open={sideBarOpen}
          />,
        classOverride: styles.mobileFormHandler
      }
    });
  }

  const handleScroll = (event: Event) => {
    const rect = brewContainer.current
      ? brewContainer.current.getBoundingClientRect()
      : new DOMRect();
      const sideBarMode = formContainer.current
        ? window.getComputedStyle(formContainer.current).position
        : 'relative';
    if (sideBarMode === 'relative') {
      if (rect.top < -30) {
        setTopSpacing((rect.top * -1) - 30);
      } else if (rect.top > -30 && rect.top < 0) {
        setTopSpacing((rect.top * -1) + rect.top);
      } else if (rect.top < 0) {
        setTopSpacing(0);
      }
    }
  }

  const nextForm = (event: any) => {
    const formOrder = [
      'settings', 'fermentables', 'hops', 'adjuncts', 'yeast',
      'mash', 'boil', 'fermentation', 'packaging', 'notes', 'tags'];
    // remove steps for extrct brews
    if (brew.batchType && brew.batchType === 'extract') {
      formOrder.splice(4, 1);
    }
    const position = formOrder.indexOf(form);
    if (position < formOrder.length -1) {
      setForm(formOrder[position + 1]);
    }
  }

  const transformNotes = () => {
    if (brew.notes) {
      return {__html: brew.notes.replace(/\n/g, '<br>')};
    }
  }

  const parseStringValues = (string: string | undefined) => {
    if (typeof string !== 'string') { return ''};
    let newString = string.charAt(0).toUpperCase() + string.slice(1)
    return newString.replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  const handleSaveBrew = async (e: any) => {
    // double check current user hasn't expired
    userDispatch({type: 'load'});
    setSaving(true);
    newBrew
      ? await brewService.saveBrew(brew, user)
        .then((res: any) => {
          setShoudlBlock(false);
          setNewBrew(false);
          setReadOnly(false);
          props.history.push(`/brew/${res.data.brew.id}`);
          snackbarDispatch({type: 'show', payload: {
            status: 'success',
            message: `Successfully saved: ${brew.name}!`
          }});
          scrollToTop(300);
          setSaving(false);
        })
        .catch((error) => {
          console.log({error});
          snackbarDispatch({type: 'show', payload: {
            status: 'error',
            message: error.response.data && !error.response.data.startsWith("<!") ? error.response.data : error.message,
          }});
          setSaving(false);
        })
      : await brewService.updateBrew(brew, user)
        .then((res: any) => {
          snackbarDispatch({type: 'show', payload: {
            status: 'success',
            message: `Successfully updated: ${brew.name}!`
          }});
          scrollToTop(300);
          setSaving(false);
        })
        .catch((error) => {
          snackbarDispatch({type: 'show', payload: {
            status: 'error',
            message: error.message,
          }});
          setSaving(false);
        })
      ;
  }

  const handleUpdateBrew = (brew: BrewInterface) => {
    brewDispatch({type: 'update', payload: brew, options: userSettings});
    if (newBrew) {
      setShoudlBlock(true);
    }
  }

  const handleDeleteBrew = () => {
    modalDispatch({
      type: 'show',
      payload: {
        title: `Are you sure you want to permanently remove <strong>${brew.name}</strong>?`,
        buttons: <>
            <button
              className="button button--brown"
              onClick={() => modalDispatch({type: 'hide'})}
            >No, cancel</button>
            <button
              className="button"
              onClick={async () => {
                await brewService.deleteBrew(brew.id, user)
                .then((res: any) => {
                  snackbarDispatch({type: 'show', payload: {
                    status: 'success',
                    message: `Sucessfully removed: ${brew.name}`
                  }});
                  modalDispatch({type: 'hide'});
                  brewDispatch({type: 'clear'});
                })
                .catch((error) => {
                  snackbarDispatch({type: 'show', payload: {
                    status: 'error',
                    message: error.message,
                  }});
                  modalDispatch({type: 'hide'});
                });
              }}
            >Yes, remove</button>
          </>
      }
    });
  }

  return loading ? <Loader className={styles.loader} color="#000" /> : (
    <section
      className={`
        ${styles.brew}
        ${sideBarOpen ? styles.open : ''}
      `}
      ref={brewContainer}
    >
      {!readOnly
        ? <Prompt
            when={shoudlBlock}
            message='You have unsaved changes, are you sure you want to leave?'
          />
        : null}
      <div className={styles.mainContent} role="main">
        <div className={styles.brew__pageHeading}>
          <h1>
            {brew.name === '' ? 'New Brew' : brew.name}
            {!readOnly
              ? <button
                  className={`button button--link ${styles.edit}`}
                  onClick={openSideBar('settings')}
                >{pen}</button>
              : null}
          </h1>
          <span>
            {!readOnly
              ? <button
                  className={`button button--link ${styles.settings}`}
                  onClick={openSideBar('settings')}
                >Settings</button>
              : null}
            {!newBrew && brew.dateBrewed
              ? <FormattedDate className={styles.dateBrewed}>{brew.dateBrewed}</FormattedDate>
              : null}
          </span>
        </div>
        {props.staticContext}
        <Card color="brew" customClass={newBrew? styles.newBrew: styles.view}>
          <div className={styles.brew__numbers}>
            <ul className={styles.brew__numbersList}>
              <li>
                Brew Method: {parseStringValues(brew.batchType)}
                {!readOnly
                  ? <button
                      className={`button button--link ${styles.edit}`}
                      onClick={openSideBar('settings')}
                    >{pen}</button>
                  : null}
              </li>
              <li>
                Batch Size: {brew.batchSize ? `${user.units === 'metric' ? parseFloat(gal2l(brew.batchSize).toFixed(2)) : brew.batchSize} ${unitLabels.vol}` : null}
                {!readOnly
                  ? <button
                      className={`button button--link ${styles.edit}`}
                      onClick={openSideBar('settings')}
                    >{pen}</button>
                  : null}
              </li>
              <li>
                System Efficiency: {brew.systemEfficiency ? `${brew.systemEfficiency}%` : null}
                {!readOnly
                  ? <button
                      className={`button button--link ${styles.edit}`}
                      onClick={openSideBar('settings')}
                    >{pen}</button>
                  : null}
              </li>
            </ul>
            <div className={styles.brew__stats}>
              <div className={styles.brew__stat}>
                <div>
                  <span className={styles.value}>{brew.alcoholContent ? `${brew.alcoholContent}%` : null}</span>
                  <label className={styles.label}>ABV</label>
                </div>
              </div>
              <div className={styles.brew__stat}>
                <div>
                  <span className={styles.value}>{brew.attenuation ? `${brew.attenuation}%` : null}</span>
                  <label className={styles.label}>ATTEN</label>
                </div>
              </div>
              <div className={styles.brew__stat}>
                <div>
                  <span className={styles.value}>{brew.ibu}</span>
                  <label className={styles.label}>IBU</label>
                </div>
              </div>
              <div className={styles.brew__stat}>
                <div>
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
          </div>
        </Card>
        <Card color="brew" customClass={`${newBrew? styles.newBrew: styles.view} ${styles.brew__editingSection}`}>
          <div className={styles.brew__header}>
            <h2>Fermentables</h2>
            {brew && brew.fermentables.length > 0
              ? <span>Total: {user.units === 'metric' ? parseFloat(lb2kg(brew.totalFermentables).toFixed(2)) : brew.totalFermentables} {unitLabels.largeWeight}</span>
              : null}
            {!readOnly
              ? <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={openSideBar('fermentables')}
                ><span>Edit</span></button>
              : null}
          </div>
          <List customClass={`${styles.brew__ingredients} ${styles.fermentables}`}>
            {brew && brew.fermentables.map((fermentable: FermentableInterface, index: number) => (
              <ListItem
                color="brew"
                clicked={!readOnly ? openSideBar('fermentables', fermentable) : null}
                key={`${fermentable.id}${index}`}
              >
                <span className={styles.firstCol}>
                {user.units === 'metric' ? parseFloat(lb2kg(fermentable.weight).toFixed(2)) : fermentable.weight} {unitLabels.largeWeight}
                </span>
                <span className={styles.secondCol}>{fermentable.name ? fermentable.name : fermentable.custom}</span>
                <span className={styles.thirdCol}>{fermentable.lovibond} °L</span>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card color="brew" customClass={`${newBrew? styles.newBrew: styles.view} ${styles.brew__editingSection}`}>
          <div className={styles.brew__header}>
            <h2>Hops</h2>
            {brew && brew.hops.length > 0
              ? <span>
                  Total: {user.units === 'metric' ? parseFloat(oz2g(brew.totalHops).toFixed(2)) : brew.totalHops} {unitLabels.smallWeight}
                </span>
              : null}
            {!readOnly
              ? <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={openSideBar('hops')}
                ><span>Edit</span></button>
              : null}
          </div>
          <List customClass={`${styles.brew__ingredients} ${styles.hops}`}>
            {brew && brew.hops.map((hop: HopInterface, index: number) => (
              <ListItem
                color="brew"
                clicked={!readOnly ? openSideBar('hops', hop) : null}
                key={`${hop.id}${index}`}
              >
                <span className={styles.firstCol}>
                  {user.units === 'metric' ? parseFloat(oz2g(hop.weight).toFixed(2)) : hop.weight} {unitLabels.smallWeight}
                </span>
                <span className={styles.secondCol}>{hop.name ? hop.name : hop.custom}</span>
                <span className={styles.thirdCol}>{hop.alphaAcid ? `${hop.alphaAcid}% AA` : null}</span>
                <span className={styles.fourthCol}>
                  {hop.lengthInBoil
                  && hop.use === 'boil' ? `${hop.lengthInBoil} min` : null}
                  {hop.days ? `${hop.days} days` : null}
                </span>
                <span className={styles.fifthCol}>
                  {hop.ibu && hop.ibu !== Infinity ? <>{hop.ibu} IBU</> : null}
                </span>
                <span className={styles.sixthCol}>
                  {hop.use ? <div style={{textTransform: 'capitalize'}}>{hop.use}</div> : null}
                </span>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card color="brew" customClass={`${newBrew? styles.newBrew: styles.view} ${styles.brew__editingSection}`}>
          <div className={styles.brew__header}>
            <h2>Adjuncts</h2>
            {!readOnly
              ? <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={openSideBar('adjuncts')}
                ><span>Edit</span></button>
              : null}
          </div>
          <List customClass={`${styles.brew__ingredients} ${styles.adjuncts}`}>
            {brew && brew.adjuncts.map((adjunct: AdjunctInterface, index: number) => (
              <ListItem
                color="brew"
                clicked={!readOnly ? openSideBar('adjuncts', adjunct) : null}
                key={`${adjunct.id}${index}`}
              >
                <span className={styles.firstCol}>
                  {adjunct.amount} {adjunct.units}
                </span>
                <span className={styles.secondCol}>{adjunct.name ? adjunct.name : adjunct.custom}</span>
                <span className={styles.thirdCol}>{adjunct.time ? `${adjunct.time} min` : null}</span>
                <span className={styles.fourthCol}>{adjunct.use}</span>
                <span className={styles.fifthCol}>{adjunct.type}</span>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card color="brew" customClass={`${newBrew? styles.newBrew: styles.view} ${styles.brew__editingSection}`}>
          <div className={styles.brew__header}>
            <h2>Yeast</h2>
            {brew && brew.yeast.length > 0
              ? <span>{brew.pitchCellCount} bn cells {brew.targetPitchingCellCount
                  ? <>of {brew.targetPitchingCellCount} bn target</>
                  : null}
                </span>
              : null}
            {!readOnly
              ? <button
                  className={`button button--icon plus ${styles.editButton}`}
                  onClick={openSideBar('yeast')}
                ><span>Edit</span></button>
              : null}
          </div>
          <List customClass={`${styles.brew__ingredients} ${styles.yeast}`}>
            {brew && brew.yeast.map((item: YeastInterface, index: number) => (
              <ListItem
                color="brew"
                clicked={!readOnly ? openSideBar('yeast', item) : null}
                key={`${item.id}${index}`}
              >
                <span className={styles.firstCol}>
                  {item.amount} {item.units === 'cells' ? 'bn cells' : item.units}
                </span>
                <span className={styles.secondCol}>
                  {item.manufacturer ? `${item.manufacturer} - ` : null}{item.name ? item.name : item.custom}
                </span>
                <span className={styles.thirdCol}>{item.averageAttenuation}% average attenuation</span>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card color="brew" customClass={newBrew? styles.newBrew: styles.view}>
          {brew.batchType && brew.batchType !== 'extract'
            ? <>
              <div className={`${styles.brew__section} ${styles.mash}`}>
                <div className={styles.brew__header}>
                  <h2>Mash</h2>
                  <span>{brew.batchType === 'BIAB' &&
                    brew.totalMashVolume &&
                    brew.kettleSize &&
                    Number(brew.totalMashVolume) > Number(brew.kettleSize)
                      ? <>Warning: Total mash volume exceeds kettle size</>
                      : null}
                  </span>
                  {!readOnly
                    ? <button
                        className={`button button--icon pen ${styles.editButton}`}
                        onClick={openSideBar('mash')}
                      ><span>Edit</span></button>
                    : null}
                </div>
                {brew && brew.mash.map((step: MashInterface, index: number) => (
                  <div
                    key={`step${index + 1}`} className={styles.mash_step}
                    onClick={!readOnly ? openSideBar('mash', step) : () => null}
                  >
                    <label className={styles.mash_label}>
                      {index + 1}: {step.type ? step.type.toUpperCase() : ''}
                    </label>
                    <div className={styles.section__values}>
                      {step.type === 'strike'
                        ? <>
                          <span>
                            {step.strikeVolume && brew.batchType !== 'BIAB' && step.strikeTemp
                              ? <>Strike with <strong>{user.units === 'metric' ? parseFloat(gal2l(step.strikeVolume).toFixed(1)) : step.strikeVolume} {unitLabels.vol}</strong> at <strong>{user.units === 'metric' ? parseFloat(f2c(step.strikeTemp).toFixed(1)) : step.strikeTemp} °{unitLabels.temp}</strong></>
                              : null}
                            {brew.totalWater && brew.batchType === 'BIAB' && step.strikeTemp
                              ? <>Strike with <strong>{brew.totalWater.toFixed(2)} {unitLabels.vol}</strong> at <strong>{user.units === 'metric' ? parseFloat(f2c(step.strikeTemp).toFixed(2)) : step.strikeTemp} °{unitLabels.temp}</strong></>
                              : null}
                          </span>
                          <span>
                            {step.targetStepTemp
                              ? <>Mash at <strong>{user.units === 'metric' ? parseFloat(f2c(step.targetStepTemp).toFixed(1)) : step.targetStepTemp} °{unitLabels.temp}</strong></>
                              : null}
                          </span>
                          <span>
                            {step.stepLength
                              ? <>Hold for <strong>{step.stepLength} min</strong></>
                              : null}
                          </span>
                          {brew.totalMashVolume && brew.batchType === 'BIAB'
                            ? <span>Total Mash Vol: <strong>{user.units === 'metric' ? parseFloat(gal2l(brew.totalMashVolume).toFixed(2)) : brew.totalMashVolume} {unitLabels.vol}</strong></span>
                            : null}
                        </>
                        : null}
                      {step.type === 'temperature' || step.type === 'decoction'
                        ? <>
                          <span>
                            {step.targetStepTemp
                              ? <>Raise to <strong>{user.units === 'metric' ? parseFloat(f2c(step.targetStepTemp).toFixed(1)) : step.targetStepTemp} °{unitLabels.temp}</strong></>
                              : null}
                          </span>
                          <span>
                            {step.stepLength
                              ? <>Hold for <strong>{step.stepLength} min</strong></>
                              : null}
                          </span>
                          </>
                        : null}
                      {step.type === 'infusion'
                        ? <>
                          <span>
                            {step.infusionWaterVol
                              ? <>Add <strong>{user.units === 'metric' ? parseFloat(qt2l(step.infusionWaterVol).toFixed(2)) : step.infusionWaterVol} {unitLabels.smallVol}</strong></>
                              : null}
                            {step.infusionWaterTemp
                              ? <> at <strong>{user.units === 'metric' ? parseFloat(f2c(step.infusionWaterTemp).toFixed(1)) : step.infusionWaterTemp} °{unitLabels.temp}</strong></>
                              : null}
                          </span>
                          <span>
                            {step.targetStepTemp
                              ? <> Bring to <strong>{user.units === 'metric' ? parseFloat(f2c(step.targetStepTemp).toFixed(1)) : step.targetStepTemp} °{unitLabels.temp}</strong></>
                              : null}
                          </span>
                          <span>
                            {step.stepLength
                              ? <>Hold for <strong>{step.stepLength} min</strong></>
                              : null}
                          </span>
                          </>
                        : null}
                      {step.type === 'sparge'
                        ? <span>
                          {step.spargeTemp
                            ? <>Sparge&nbsp;
                              {step.spargeVolume
                                ? <>with <strong>{user.units === 'metric' ? parseFloat(gal2l(step.spargeVolume).toFixed(2)) : step.spargeVolume} {unitLabels.vol}</strong> </>
                                : null}
                              at <strong>{user.units === 'metric' ? parseFloat(f2c(step.spargeTemp).toFixed(1)) : step.spargeTemp} °{unitLabels.temp}</strong></>
                            : null}
                        </span>
                        : null}
                    </div>
                  </div>
                ))}
              </div>
              </>
            : null}
          <div className={styles.brew__section}>
            <div className={styles.brew__header}>
              <h2>Boil</h2>
              {!readOnly
                ? <button
                    className={`button button--icon pen ${styles.editButton}`}
                    onClick={openSideBar('boil')}
                  ><span>Edit</span></button>
                : null}
            </div>
            {brew.batchType === 'partialMash' && brew.preBoilVolume && brew.mash.some((item: MashInterface) => item.spargeVolume)
              ? <div style={{padding: "15px 0 0 15px"}}>Top off with <strong>
                  {user.units === 'metric' ? parseFloat(gal2l(brew.topOff).toFixed(2)) : brew.topOff} {unitLabels.vol}
                </strong></div>
              : null}
            <div className={`${styles.section__values} ${styles.withStats}`}>
              <span>{brew.preBoilVolume
                ? <>Boil Vol: <strong>{user.units === 'metric' ? parseFloat(gal2l(brew.preBoilVolume).toFixed(2)) : brew.preBoilVolume} {unitLabels.vol}</strong></>
                : null}</span>
              <span>{brew.boilLength
                ? <>Boil Time: <strong>{brew.boilLength} min</strong></>
                : null}</span>
              {brew.batchType !== 'partialMash'
                ? <span></span>
                : null}
              <div className={styles.section__stats}>
                <div className={styles.brew__stat}>
                  <div>
                    <span className={styles.value}>{brew.preBoilG}</span>
                    <label className={styles.label}>PRE</label>
                  </div>
                </div>
                <span className={styles.arrow}></span>
                <div className={styles.brew__stat}>
                  <div>
                    <span className={styles.value}>{brew.og}</span>
                    <label className={styles.label}>OG</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.brew__section} ${styles.fermentation}`}>
            <div className={styles.brew__header}>
              <h2>Fermentation</h2>
              {!readOnly
                ? <button
                    className={`button button--icon pen ${styles.editButton}`}
                    onClick={openSideBar('fermentation')}
                  ><span>Edit</span></button>
                : null}
            </div>
            <div className={`${styles.section__values} ${styles.withStats}`}>
              <span>
                {brew.primaryLength
                  ? <>Primary: <strong>{brew.primaryLength} days</strong></>
                  : null}
              </span>
              <span>
                {brew.primaryTemp
                  ? <>Temp: <strong>{user.units === 'metric' ? parseFloat(f2c(brew.primaryTemp).toFixed(1)) : brew.primaryTemp} °{unitLabels.temp}</strong></>
                  : null}
              </span>
              <span>
                {brew.secondaryLength
                  ? <>Secondary: <strong>{brew.secondaryLength} days</strong></>
                  : null}
              </span>
              <span>
                {brew.secondaryTemp
                  ? <>Temp: <strong>{user.units === 'metric' ? parseFloat(f2c(brew.secondaryTemp).toFixed(1)) : brew.secondaryTemp} °{unitLabels.temp}</strong></>
                  : null}
              </span>
              <span></span>
              <div className={styles.section__stats}>
                <div className={styles.brew__stat}>
                  <div>
                    <span className={styles.value}>{brew.og}</span>
                    <label className={styles.label}>OG</label>
                  </div>
                </div>
                <span className={styles.arrow}></span>
                <div className={styles.brew__stat}>
                  <div>
                    <span className={styles.value}>{brew.fg}</span>
                    <label className={styles.label}>FG</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.brew__section}>
            <div className={styles.brew__header}>
              <h2>Packaging</h2>
              {!readOnly
                ? <button
                    className={`button button--icon pen ${styles.editButton}`}
                    onClick={openSideBar('packaging')}
                  ><span>Edit</span></button>
                : null}
            </div>
            <div className={styles.section__values}>
              <span>{brew.packagingType && brew.carbonationMethod
                ? <strong>{parseStringValues(brew.packagingType)}/{parseStringValues(brew.carbonationMethod)}</strong>
                : null}
              </span>
              <span>{brew.CO2VolumeTarget
                ? <>CO<sub>2</sub> Vol: <strong>{brew.CO2VolumeTarget}</strong></>
                : null}</span>
              <span>{brew.beerTemp
                ? <>Temp: <strong>{user.units === 'metric' ? parseFloat(f2c(brew.beerTemp).toFixed(1)) : brew.beerTemp} °{unitLabels.temp}</strong></>
                : null}</span>
              <span>{brew.amountForCO2
                ? <>{brew.carbonationMethod === 'forced' ? 'Pressure: ' : 'Amount: '}
                <strong>{brew.amountForCO2} {brew.carbonationMethod === 'forced' ? 'psi' : unitLabels.smallWeight}</strong></>
                : null}
              </span>
            </div>
          </div>
          <div className={styles.brew__section}>
            <div className={styles.brew__header}>
              <h2>Notes</h2>
              {!readOnly
                ? <button
                    className={`button button--icon pen ${styles.editButton}`}
                    onClick={openSideBar('notes')}
                  ><span>Edit</span></button>
                : null}
            </div>
            <div className={styles.brew__notes}>
              {brew.notes
                ? <div dangerouslySetInnerHTML={transformNotes()} />
                : null
              }
            </div>
            <div className={styles.tagsWrapper}>
              {brew.tags
                ? brew.tags.split(',').map((tag: string, i: number) => {
                    return <div className="tag" key={i}>{tag}</div>
                  })
                : null
              }
              {!readOnly
                ? <button
                  className={`button ${styles.tagsButton}`}
                  onClick={openSideBar('tags')}
                >Tags</button>
              : null}
            </div>
          </div>
        </Card>
        {!readOnly
          ? <button
              type="submit"
              className={`button button--large ${styles.saveButton} ${saving ? styles.saving : null}`}
              onClick={handleSaveBrew}
            >
              {newBrew? <>Save &amp; Get Brewing!</> : <>Update Brew</>}
              {saving ? <Loader className={styles.savingLoader} /> : null}
            </button>
          : null}
      </div>
      <div className={styles.sideBar} role="complementary" ref={formContainer}>
        <Card color="brew" customStyle={top} customClass={`${styles.formsContainer}`}>
          <FormHandler
            form={form}
            nextForm={nextForm}
            editingData={editingData}
            closeSidebar={closeSidebar}
            updateBrew={handleUpdateBrew}
            deleteBrew={handleDeleteBrew}
            open={sideBarOpen}
          />
        </Card>
      </div>
    </section>
  );
}

export default Brew;