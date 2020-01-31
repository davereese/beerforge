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
import { totalWater } from '../../resources/javascript/calculator';
import cloneImg from '../../resources/images/clone.svg';
import resultsImg from '../../resources/images/history.svg';
import searchImg from '../../resources/images/searchDarker.svg';

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
      modalDispatch({type: 'hide'});
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
      const copiedBrew= JSON.parse(JSON.stringify(brew));
      setOriginalBrew(copiedBrew);
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

  const getBrew = async (brewId: number, callback: Function | null = null) => {
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
        callback !== null && callback();
      })
      .catch((error) => {
        showBasicError(error);
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
      showBasicError(error);
      props.history.push('/dashboard');
    });
  };

  const getBrewdayResults = async () =>{
    brewService.getBrewResults(brew.id, user)
    .then((res: any) => {
      // add total water to brewday results brew
      const brewdayBrew = res.data.brew;
      brewdayBrew.totalWater = totalWater(
        brewdayBrew.batchSize,
        brewdayBrew.boilLength,
        brewdayBrew.evaporationRate,
        brew.totalFermentables,
        userSettings);
      brewDispatch({type: 'replace', payload: brewdayBrew, options: userSettings});
      scrollToTop(300);
    })
    .catch((error) => {
      // 404 if a brew hasn't had any results saved yet
      if (error.response.status !== 404) {
        showBasicError(error);
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
          setCloning(false);
          props.history.push(`/brew/${res.data.brew.id}`);
          snackbarDispatch({type: 'show', payload: {
            status: 'success',
            message: `Successfully saved: ${brew.name}!`
          }});
          scrollToTop(300);
          setSaving(false);
          brewDispatch({
            type: 'process',
            payload: res.data.brew,
            options: userSettings
          });
        })
        .catch((error) => {
          snackbarDispatch({type: 'show', payload: {
            status: 'error',
            message: typeof error.response.data === 'object'
              ? error.response.statusText
              : error.response.data
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
            showBasicError(error);
            setSaving(false);
          })
        : await brewService.updateBrewResults(brew, user)
          .then((res: any) => {
            updateSuccess()
            brewDispatch({type: 'replace', payload: res.data.brew, options: userSettings});
          })
          .catch((error) => {
            console.log(error);
            showBasicError(error);
            setSaving(false);
          })
        ;
    }
  }

  const handleUpdateBrew = (updatedBrew: BrewInterface) => {
    const action = brewdayResults ? 'replace' : 'update';
    if (Object.entries(updatedBrew).length !== 0 && updatedBrew.constructor === Object) {
      brewDispatch({type: action, payload: updatedBrew, options: userSettings});
    }
    setShouldBlock(true);
  }

  const handleCloneBrew = () => (e: any) => {
    modalDispatch({
      type: 'show',
      payload: {
        title: !readOnly ? 'Clone or Re-brew' : 'Clone Brew',
        body: !readOnly
          ? <p>Select <strong>clone</strong> to duplicate the brew as a new recipe, or select <strong>re-brew</strong> to preserve this recipe's history and track it over time.<br /><br /></p>
          : <p>Clone this recipe to try it yourself.<br /><br /></p>,
        image: <img src={cloneImg} alt="" className={styles.modalImage} />,
        buttons: <>
          <button
            className="button button--brown"
            onClick={() => modalDispatch({type: 'hide'})}
          >Cancel</button>
          <button
            className="button"
            onClick={() => {
              setCloning(true);
              closeSidebar();
              modalDispatch({type: 'hide'});
              checkShouldBlock(() => brewDispatch({type: 'clone'}));
            }}
          >Clone</button>
          {!readOnly && <button
            className="button"
            onClick={() => {
              setCloning(true);
              closeSidebar();
              modalDispatch({type: 'hide'});
              checkShouldBlock(() => brewDispatch({type: 'rebrew'}))
            }}
          >Re-brew</button>}
        </>
      }
    });
  };

  const handleAddBrewdayResults = () => (e: any) => {
    checkShouldBlock(() => triggerBrewdayResults())
  }

  const checkShouldBlock = (func: Function) => {
    if (shouldBlock) {
      modalDispatch({
        type: 'show',
        payload: {
          title: 'You have unsaved changes to this brew.',
          body: <p>Do you want to save and continue, or proceed without saving?<br /><br /></p>,
          image: <img src={searchImg} alt="" className={styles.modalImageSmaller} />,
          buttons: <>
            <button
              className="button button--brown"
              onClick={() => modalDispatch({type: 'hide'})}
            >Cancel</button>
            <button
              className="button"
              onClick={async () => {
                const promise = !brewdayResults
                  ? brewService.updateBrew(brew, user)
                  : brewService.updateBrewResults(brew, user)
                await promise
                  .then((res: any) => {
                    setShouldBlock(false);
                    func()
                  })
                  .catch((error) => {
                    modalDispatch({type: 'hide'});
                    showBasicError(error);
                  });
              }}
            >Save</button>
            <button
              className="button"
              onClick={() => {
                !brewdayResults ? getBrew(brew.id, () => func()) : func();
                setShouldBlock(false);
              }}
            >Don't Save</button>
          </>
        }
      });
    } else {
      func();
    }
  };

  const triggerBrewdayResults = () => {
      if (
        !readOnly &&
        !brewdayResults &&
        document.cookie.replace(/(?:(?:^|.*;\s*)brewdayResults\s*=\s*([^;]*).*$)|^.*$/, "$1") !== "true"
      ) {
        modalDispatch({
          type: 'show',
          payload: {
            title: 'Brewday Results',
            body: <p>This mode helps track what was planned vs. what actually happened. All numbers are editable except for the ingredients. <strong>Just click on the number to edit.</strong> Changes made here will not have any affect on the original brew.<br /><br /></p>,
            image: <img src={resultsImg} alt="" className={styles.modalImage} />,
            buttons: <>
              <button
                className="button button--brown"
                onClick={() => modalDispatch({type: 'hide'})}
              >Go Back</button>
              <button
                className="button"
                onClick={async () => {
                  modalDispatch({type: 'hide'});
                  setBrewdayResults(true);
                  var future = new Date();
                  new Date(future.setDate(future.getDate() + 30)).toString();
                  document.cookie = `brewdayResults=true; expires=${future}`;
                }}
              >Got it</button>
            </>
          }
        })
      } else {
        modalDispatch({type: 'hide'});
        setBrewdayResults(!brewdayResults);
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
                  showBasicError(error);
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
    setShouldBlock(false);
  }

  const showBasicError = (error: any) => {
    snackbarDispatch({type: 'show', payload: {
      status: 'error',
      message: error.message,
    }});
  }

  // TEMPLATE

  const commonProps = {
    readOnly,
    newBrew,
    brewdayResults,
    brew,
    unitLabels,
    openSideBar,
    user,
    originalBrew
  }

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
            message='You have unsaved changes. Are you sure you want to leave?'
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
            {currentPageIndex !== undefined && !brewdayResults && !newBrew &&
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
            clone={handleCloneBrew}
            brewdayResultsToggle={handleAddBrewdayResults}
            applyEdit={handleUpdateBrew}
            options={userSettings}
            {...commonProps}
          />
          <BrewFermentables
            {...commonProps}
          />
          <BrewHops
            {...commonProps}
          />
          <BrewAdjuncts
            {...commonProps}
          />
          <BrewYeast
            {...commonProps}
          />
          <Card color="brew" customClass={newBrew ? styles.new : brewdayResults ? styles.res : styles.view}>
            {brew.batchType && brew.batchType !== 'extract'
              ? <BrewMash
                  applyEdit={handleUpdateBrew}
                  options={userSettings}
                  {...commonProps}
                />
              : null}
            <BrewBoil
              applyEdit={handleUpdateBrew}
              options={userSettings}
              {...commonProps}
            />
            <BrewFermentation
              applyEdit={handleUpdateBrew}
              {...commonProps}
            />
            {!brewdayResults &&<BrewPackaging
                {...commonProps}
              />}
            {!brewdayResults && <BrewNotes
                {...commonProps}
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