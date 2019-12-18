import React, { useState, useEffect, useRef } from 'react';
import { Prompt } from 'react-router'
import { RouteComponentProps, Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import FormHandler from './FormHandler/FormHandler';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';
import {
  BrewInterface,
} from '../../Store/BrewContext';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { pen } from '../../resources/javascript/penSvg.js';
import { isEmpty } from '../../resources/javascript/isEmpty';
import { usePrevious } from '../../resources/javascript/usePreviousHook';
import { useUser } from '../../Store/UserContext';
import { useBrew, processOptionsInterface } from '../../Store/BrewContext';
import { useModal } from '../../Store/ModalContext';
import { useSnackbar } from '../../Store/SnackbarContext';
import * as brewService from '../../Store/BrewService';
import BrewSettings from './BrewComponents/BrewSettings';
import BrewFermentables from './BrewComponents/BrewFermentables';
import BrewHops from './BrewComponents/BrewHops';
import BrewAdjuncts from './BrewComponents/BrewAdjuncts';
import BrewYeast from './BrewComponents/BrewYeast';
import BrewMash from './BrewComponents/BrewMash';
import BrewBoil from './BrewComponents/BrewBoil';
import BrewFermentation from './BrewComponents/BrewFermentation';
import BrewPackaging from './BrewComponents/BrewPackaging';
import BrewNotes from './BrewComponents/BrewNotes';

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
  const [shouldBlock, setShouldBlock] = useState(false);
  const [currentUser, setCurrentUser] = useState(true);
  const [userViewing, setUserViewing] = useState<any>({});

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
    } else if (editingData === null && form !== '') {
      if (sideBarMode === "fixed") {
        openModalForm();
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
    if (newBrew && shouldBlock) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  });

  const getBrew = async (brewId: number) => {
    setLoading(true);
    await brewService.getBrew(brewId, user)
      .then((res: any) => {
        setLoading(false);
        setNewBrew(false);
        if (res.data.brew.userId !== user.id) {
          getUser(res.data.brew.userId);
        }
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

  const getUser = async (userId: number) => {
    setLoading(true);
    await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/users/${userId}`, {
      headers: {'authorization': user ? user.token : null},
    }).then(result => {
      setLoading(false);
      setCurrentUser(false);
      setUserViewing(result.data);
    })
    .catch((error) => {
      snackbarDispatch({type: 'show', payload: {
        status: 'error',
        message: error.message,
      }});
      props.history.push('/dashboard');
    });
  }

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

  const handleSaveBrew = async (e: any) => {
    // double check current user hasn't expired
    userDispatch({type: 'load'});
    setSaving(true);
    newBrew
      ? await brewService.saveBrew(brew, user)
        .then((res: any) => {
          setShouldBlock(false);
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
          snackbarDispatch({type: 'show', payload: {
            status: 'error',
            message: error.response.data
              && error.response.data.length > 0
              && !error.response.data.startsWith("<!")
                ? error.response.data
                : error.message,
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
      setShouldBlock(true);
    }
    // setEditingData(null);
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
            when={shouldBlock}
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
              {!currentUser
                && <Link
                    to={`/user/${userViewing.id}`}
                    className={styles.userLink}
                  >
                    {userViewing.username}
                  </Link>
              }
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
        <BrewSettings
          readOnly={readOnly}
          newBrew={newBrew}
          brew={brew}
          unitLabels={unitLabels}
          openSideBar={openSideBar}
          user={user}
        />
        <BrewFermentables
          readOnly={readOnly}
          newBrew={newBrew}
          brew={brew}
          unitLabels={unitLabels}
          openSideBar={openSideBar}
          user={user}
        />
        <BrewHops
          readOnly={readOnly}
          newBrew={newBrew}
          brew={brew}
          unitLabels={unitLabels}
          openSideBar={openSideBar}
          user={user}
        />
        <BrewAdjuncts
          readOnly={readOnly}
          newBrew={newBrew}
          brew={brew}
          unitLabels={unitLabels}
          openSideBar={openSideBar}
          user={user}
        />
        <BrewYeast
          readOnly={readOnly}
          newBrew={newBrew}
          brew={brew}
          unitLabels={unitLabels}
          openSideBar={openSideBar}
          user={user}
        />
        <Card color="brew" customClass={newBrew? styles.newBrew: styles.view}>
          {brew.batchType && brew.batchType !== 'extract'
            ? <BrewMash
                readOnly={readOnly}
                newBrew={newBrew}
                brew={brew}
                unitLabels={unitLabels}
                openSideBar={openSideBar}
                user={user}
              />
            : null}
          <BrewBoil
            readOnly={readOnly}
            newBrew={newBrew}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <BrewFermentation
            readOnly={readOnly}
            newBrew={newBrew}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <BrewPackaging
            readOnly={readOnly}
            newBrew={newBrew}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <BrewNotes
            readOnly={readOnly}
            newBrew={newBrew}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
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