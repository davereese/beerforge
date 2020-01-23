import React, { useState, useEffect, useRef } from 'react';
import { Prompt } from 'react-router'
import { RouteComponentProps, Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import FormHandler from './FormHandler/FormHandler';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';
import { BrewInterface, brewHistory } from '../../Store/BrewContext';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
import { isEmpty } from '../../resources/javascript/isEmpty';
import { usePrevious } from '../../resources/javascript/usePreviousHook';
import { useUser } from '../../Store/UserContext';
import { useBrew, processOptionsInterface } from '../../Store/BrewContext';
import { useModal } from '../../Store/ModalContext';
import { useSnackbar } from '../../Store/SnackbarContext';
import * as brewService from '../../Store/BrewService';
import BrewSettingsAndStats from './BrewComponents/BrewSettingsAndStats';
import BrewFermentables from './BrewComponents/BrewFermentables';
import BrewHops from './BrewComponents/BrewHops';
import BrewAdjuncts from './BrewComponents/BrewAdjuncts';
import BrewYeast from './BrewComponents/BrewYeast';
import BrewMash from './BrewComponents/BrewMash';
import BrewBoil from './BrewComponents/BrewBoil';
import BrewFermentation from './BrewComponents/BrewFermentation';
import BrewPackaging from './BrewComponents/BrewPackaging';
import BrewNotes from './BrewComponents/BrewNotes';
import BrewHistoryNav from './BrewComponents/BrewHistoryNav';
import BrewHistoryList from './BrewComponents/BrewHistoryList';

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
  const [brewdayResults, setBrewdayResults] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [topSpacing, setTopSpacing] = useState(0);
  const [form, setForm] = useState('');
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shouldBlock, setShouldBlock] = useState(false);
  const [currentUser, setCurrentUser] = useState(true);
  const [userViewing, setUserViewing] = useState<any>({});
  const [cloning, setCloning] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState();
  const [changeBrew, setChangeBrew] = useState(false);
  const [showBrewHistory, setShowBrewHistory] = useState(false);
  const [originalBrew, setOriginalBrew] = useState<BrewInterface | null>(null)

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

  // USEEFFECT

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
      setChangeBrew(false);
    }

    if (brew.history && brew.history.length > 0) {
      const index = brew.history.findIndex((item: brewHistory) =>
        item.id === brew.id
      );
      setCurrentPageIndex(index);
    }

    setEditingData(null);

    if (!cloning && prevBrew && prevBrew.id && !brew.id) {
      // if we aren't cloning and had a brew with an id, and all of a sudden we don't,
      // we must have deleted it. Redirect to the dashboard.
      props.history.push('/dashboard');
    } else if (cloning && prevBrew && prevBrew.id && !brew.id) {
      // otherwise, we are cloning
      props.history.push('/brew');
      setNewBrew(true);
      setShouldBlock(true);
      setReadOnly(false);
      setCurrentUser(true);
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

  // Brewday results toggle
  useEffect(() => {
    if (brewdayResults) {
      setOriginalBrew(brew);
      getBrewdayResults();
      closeSidebar();
    } else {
      const brewId = Number(window.location.pathname.split('/')[2]);
      if (!isNaN(brewId)) {
        getBrew(brewId);
        setOriginalBrew(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brewdayResults]);

  useEffect(() => {
    // Watch changes for prompt display
    if (newBrew && shouldBlock) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  });


  // METHODS

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
        showError(error);
        if (isEmpty(user)) {
          props.history.push('/');
        } else {
          props.history.push('/dashboard');
        }
      });
  };

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
      showError(error);
      props.history.push('/dashboard');
    });
  };

  const getBrewdayResults = async () =>{
    brewService.getBrewResults(brew.id, user)
    .then((res: any) => {
      brewDispatch({type: 'replace', payload: res.data.brew, options: userSettings});
      scrollToTop(300);
    })
    .catch((error) => {
      // 404 if a brew hasn't had any results saved yet
      if (error.response.status !== 404) {
        showError(error);
        setBrewdayResults(false);
      }
    });
  };

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
            brewdayResults={brewdayResults}
          />,
        classOverride: styles.mobileFormHandler
      }
    });
  }

  const handleScroll = (e: any) => {
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

  const nextForm = (e: any) => {
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

  const handleHistoryNavClicked = (page: number) => (e: any) => {
    if (page !== currentPageIndex) {
      // change page
      const brewId = brew.history[page].id;
      const target = e.currentTarget.localName;
      setChangeBrew(true);
      window.setTimeout(() => {
        if (target === 'div') {
          setShowBrewHistory(false);
        }
        props.history.push(`/brew/${brewId}`);
        closeSidebar();
        getBrew(brewId);
      }, 500);
    } else {
      // reveal history comparison
      closeSidebar();
      setShowBrewHistory(!showBrewHistory);
    }
  }

  const handleSaveBrew = async (e: any) => {
    // double check current user hasn't expired
    userDispatch({type: 'load'});
    setSaving(true);
    if (newBrew) {
      await brewService.saveBrew(brew, user)
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
        });
    } else {
      !brewdayResults
        ? await brewService.updateBrew(brew, user)
          .then((res: any) => {
            updateSuccess()
          })
          .catch((error) => {
            showError(error);
            setSaving(false);
          })
        : await brewService.updateBrewResults(brew, user)
          .then((res: any) => {
            updateSuccess()
            brewDispatch({type: 'replace', payload: res.data.brew, options: userSettings});
          })
          .catch((error) => {
            console.log(error);
            showError(error);
            setSaving(false);
          })
        ;
    }
  }

  const handleUpdateBrew = (brew: BrewInterface) => {
    const action = brewdayResults ? 'replace' : 'update';
    if (Object.entries(brew).length !== 0 && brew.constructor === Object) {
      brewDispatch({type: action, payload: brew, options: userSettings});
    }
    if (newBrew) {
      setShouldBlock(true);
    }
  }

  const handleCloneBrew = () => (e: any) => {
    modalDispatch({
      type: 'show',
      payload: {
        title: !readOnly ? 'Clone or Re-brew' : 'Clone Brew',
        body: !readOnly
          ? <p>Clone to duplicate the brew as a new recipe, or re-brew to preserve this recipe's history and track it over time.<br /><br /></p>
          : <p>Clone this recipe to try it yourself.<br /><br /></p>,
        buttons: <>
          <button
            className="button button--brown"
            onClick={() => modalDispatch({type: 'hide'})}
          >Cancel</button>
          <button
            className="button"
            onClick={() => {
              setCloning(true);
              brewDispatch({type: 'clone'});
              modalDispatch({type: 'hide'});
            }}
          >Clone</button>
          {!readOnly && <button
            className="button"
            onClick={() => {
              setCloning(true);
              brewDispatch({type: 'rebrew'});
              modalDispatch({type: 'hide'});
            }}
          >Re-brew</button>}
        </>
      }
    });
  };

  const handleAddBrewdayResults = () => (e: any) => {
    // if (!readOnly && !brewdayResults) {
    //   modalDispatch({
    //     type: 'show',
    //     payload: {
    //       title: 'View & Edit Brewday Results',
    //       body: <p>Brewday Results mode helps track what was planned vs. what actually happened. In this mode, all numbers are editable except for the ingredients. <strong>Just click on the number to edit.</strong> Mash and Fermentation can be fully edited, but no automatic calculations will be made.<br /><br /></p>,
    //       buttons: <>
    //         <button
    //           className="button button--brown"
    //           onClick={() => modalDispatch({type: 'hide'})}
    //         >Go Back</button>
    //         <button
    //           className="button"
    //           onClick={async () => {
    //             modalDispatch({type: 'hide'});
    //             setBrewdayResults(true);
    //           }}
    //         >Got it</button>
    //       </>
    //     }
    //   })
    // } else {
      setBrewdayResults(!brewdayResults);
    // }
  };

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
                await brewService.deleteBrew(brew.id, user, currentPageIndex === 0 ? true : false)
                .then((res: any) => {
                  snackbarDispatch({type: 'show', payload: {
                    status: 'success',
                    message: `Sucessfully removed: ${brew.name}`
                  }});
                  modalDispatch({type: 'hide'});
                  brewDispatch({type: 'clear'});
                })
                .catch((error) => {
                  showError(error);
                  modalDispatch({type: 'hide'});
                });
              }}
            >Yes, remove</button>
          </>
      }
    });
  }

  const updateSuccess = () => {
    snackbarDispatch({type: 'show', payload: {
      status: 'success',
      message: `Successfully updated: ${brew.name}!`
    }});
    scrollToTop(300);
    setSaving(false);
  }

  const showError = (error: any) => {
    snackbarDispatch({type: 'show', payload: {
      status: 'error',
      message: error.message,
    }});
  }

  // TEMPLATE

  return loading ? <Loader className={styles.loader} color="#000" /> : (
    <section
      className={`
        ${styles.brew}
        ${sideBarOpen ? styles.open : ''}
        ${changeBrew ? styles.fadeOut : ''}
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
          <h1
            title={brew.name === '' ? 'New Brew' : brew.name}
            className={showBrewHistory ? styles.showBrewHistory : ''}
          >
            {brew.name === '' ? 'New Brew' : brew.name}
            <div className={styles.brew__pageSubHeading}>
              {!currentUser // not current user's brew (viewing someone else's)
                && <Link
                    to={`/user/${userViewing.id}`}
                    className={styles.userLink}
                  >
                    @{userViewing.username}
                  </Link>
                }
              {currentPageIndex !== undefined && !showBrewHistory &&
                <span className={styles.subHeading}>{currentPageIndex === 0 ? 'Initial Brew' : 'Re-Brew'}</span>
              }
              {brewdayResults && !showBrewHistory &&
                <span className={styles.brewdayResultsLabel}>Brewday Results</span>
              }
              {showBrewHistory &&
                <span className={styles.subHeading}>Brew History</span>
              }
            </div>
          </h1>
          <div className={styles.pageHeading__items}>
            {!newBrew && brew.dateBrewed
              ? <FormattedDate
                  className={`${styles.dateBrewed} ${showBrewHistory ? styles.fadeOut : ''}`}
                >{brew.dateBrewed}</FormattedDate>
              : null}
            {currentPageIndex !== undefined && !brewdayResults &&
              <BrewHistoryNav
                historyLength={brew.history ? brew.history.length : null}
                currentPage={currentPageIndex}
                pageClicked={handleHistoryNavClicked}
              />}
          </div>
        </div>
        {props.staticContext}
        {showBrewHistory &&
          <BrewHistoryList
            brew={brew}
            unitLabels={unitLabels}
            user={user}
            itemClicked={handleHistoryNavClicked}
          />}
        {!showBrewHistory &&
          <><BrewSettingsAndStats
            readOnly={readOnly}
            newBrew={newBrew}
            brewdayResults={brewdayResults}
            brew={brew}
            originalBrew={originalBrew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            clone={handleCloneBrew}
            brewdayResultsToggle={handleAddBrewdayResults}
            user={user}
            applyEdit={handleUpdateBrew}
          />
          <BrewFermentables
            readOnly={readOnly}
            newBrew={newBrew}
            brewdayResults={brewdayResults}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <BrewHops
            readOnly={readOnly}
            newBrew={newBrew}
            brewdayResults={brewdayResults}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <BrewAdjuncts
            readOnly={readOnly}
            newBrew={newBrew}
            brewdayResults={brewdayResults}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <BrewYeast
            readOnly={readOnly}
            newBrew={newBrew}
            brewdayResults={brewdayResults}
            brew={brew}
            unitLabels={unitLabels}
            openSideBar={openSideBar}
            user={user}
          />
          <Card color="brew" customClass={newBrew ? styles.new : brewdayResults ? styles.res : styles.view}>
            {brew.batchType && brew.batchType !== 'extract'
              ? <BrewMash
                  readOnly={readOnly}
                  newBrew={newBrew}
                  brewdayResults={brewdayResults}
                  brew={brew}
                  unitLabels={unitLabels}
                  openSideBar={openSideBar}
                  user={user}
                  applyEdit={handleUpdateBrew}
                />
              : null}
            <BrewBoil
              readOnly={readOnly}
              newBrew={newBrew}
              brewdayResults={brewdayResults}
              brew={brew}
              unitLabels={unitLabels}
              openSideBar={openSideBar}
              user={user}
              applyEdit={handleUpdateBrew}
            />
            <BrewFermentation
              readOnly={readOnly}
              newBrew={newBrew}
              brewdayResults={brewdayResults}
              brew={brew}
              unitLabels={unitLabels}
              openSideBar={openSideBar}
              user={user}
              applyEdit={handleUpdateBrew}
            />
            {!brewdayResults &&<BrewPackaging
                readOnly={readOnly}
                newBrew={newBrew}
                brew={brew}
                unitLabels={unitLabels}
                openSideBar={openSideBar}
                user={user}
              />}
            {!brewdayResults && <BrewNotes
                readOnly={readOnly}
                newBrew={newBrew}
                brew={brew}
                unitLabels={unitLabels}
                openSideBar={openSideBar}
                user={user}
              />}
          </Card>
          {!readOnly
            ? <button
                type="submit"
                className={`button button--large ${styles.saveButton} ${saving ? styles.saving : null}`}
                onClick={handleSaveBrew}
              >
                {newBrew? <>Save &amp; Get Brewing!</> : <>Update {brewdayResults ? 'Results' : 'Brew'}</>}
                {saving ? <Loader className={styles.savingLoader} /> : null}
              </button>
            : null}
        </> /* !showBrewHistory */}
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
            brewdayResults={brewdayResults}
          />
        </Card>
      </div>
    </section>
  );
}

export default Brew;