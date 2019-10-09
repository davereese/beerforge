import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce'

import styles from './Profile.module.scss';
import formStyles from '../../components/Forms/Forms.module.scss';
import Avatar from '../../components/Avatar/Avatar';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';
import { useUser } from '../../Store/UserContext';
import { useModal } from '../../Store/ModalContext';
import { useSnackbar } from '../../Store/SnackbarContext';
import Info from '../../components/Info/Info';

const Profile = () => {
  const fileInput = React.createRef<HTMLInputElement>();
  const [user, userDispatch] = useUser();
  // eslint-disable-next-line
  const [snackbar, snackbarDispatch] = useSnackbar();
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    edited: false,
    units: user.units ? user.units : 'us',
    ibuFormula: user.ibu_formula ? user.ibu_formula : 'rager',
    kettle: user.kettle_size ? user.kettle_size : '',
    evapRate: user.evap_rate ? user.evap_rate : '',
    strikeFactor: user.strike_adjustment ? user.strike_adjustment : ''
  });
  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.title = "BeerForge | Profile";
  }, [])

  useEffect(() => {
    if (settings.edited === true) {
      handleChangeSettings();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleChangeSettings = debounce(() => {
    updateUser();
  }, 300);

  const updateUser = async () => {
    try {
      delete settings.edited;
      // build our body for the request
      const body = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        ...settings
      };
      const authHeaders = {'authorization': user ? user.token : null};

      const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/users/${user.id}`, body, {
        headers: authHeaders,
      });
      userDispatch({type: 'update', payload: res.data[0]});
      setSaving(false);
      snackbarDispatch({type: 'show', payload: {
        status: 'success',
        message: 'Profile updated',
      }});
    } catch (error) {
      setSaving(false);
      snackbarDispatch({type: 'show', payload: {
        status: 'error',
        message: error.message,
      }});
    }
  }

  const handleUpdateUser = () => {
    setSaving(true);
    updateUser();
  }

  const deleteUser = async () => {
    try {
      const authHeaders = {'authorization': user ? user.token : null};

      await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/users/${user.id}`, {
        headers: authHeaders,
      });
      snackbarDispatch({type: 'show', payload: {
        status: 'success',
        message: 'Account deleted',
      }});
      userDispatch({type: 'logout'});
    } catch (error) {
      snackbarDispatch({type: 'show', payload: {
        status: 'error',
        message: error.message,
      }});
    }
  }

  const handleDeleteUser = () => {
    modalDispatch({
      type: 'show',
      payload: {
        title: `Are you sure you want to permanently remove your user account?`,
        buttons: <>
            <button
              className="button button--brown"
              onClick={() => modalDispatch({type: 'hide'})}
            >No, cancel</button>
            <button
              className="button"
              onClick={() => {
                deleteUser();
                modalDispatch({type: 'hide'})
              }}
            >Yes, remove</button>
          </>
      }
    });
  }

  const fileAdded = (e: any) => {
    let name = '';
    if (
      fileInput.current &&
      fileInput.current.files &&
      fileInput.current.files.length > 0
    ) {
      name = fileInput.current.files[0].name;
    }

    setFile(name);
  };

  const uploadBrews = async (e: any) => {
    // before we start using the current user, let's just make sure they haven't expired, shall we?
    userDispatch({type: 'load'});
    if (
      fileInput.current &&
      fileInput.current.files &&
      fileInput.current.files.length > 0
    ) {
      try {
        setUploading(true);

        const formData = new FormData();
        formData.append('beerxml', fileInput.current.files[0]);
        const authHeaders = {
          'authorization': user ? user.token : null,
          'Content-Type': 'multipart/form-data'
        };

        const result = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/brews/upload`, formData, {
          headers: authHeaders,
        });

        if (result.status === 202) {
          setUploading(false);
          setFile('');
          // fileInput.current.value = '';
          snackbarDispatch({type: 'show', payload: {
            status: 'success',
            message: 'Upload success!',
          }});
        }
      } catch (error) {
        setUploading(false);
        setFile('');
        // fileInput.current.value = '';
        snackbarDispatch({type: 'show', payload: {
          status: 'error',
          message: error.message,
        }});
      }
    }
  };

  return (
    <section className={styles.profile}>
      <header>
        <div className={styles.profilePic}>
          <Avatar user={user} />
        </div>
        <h1 className={styles.infoContainer__header}>
          {user.username ? user.username : `${user.first_name} ${user.last_name}`}
          <span>Joined <FormattedDate>{user.date_joined}</FormattedDate></span>
        </h1>
      </header>
      <label className="divider"><span>User Info</span></label>
      <div className={styles.form}>
            id="firstName"
            className="dark"
            value={firstName ? firstName : ''}
            onChange={ (e) => setFirstName(e.target.value) }
          />
        </label>
        <label>Last Name<br />
          <input
            type="text"
            placeholder="Last Name"
            id="lastName"
            className="dark"
            value={lastName ? lastName : ''}
            onChange={ (e) => setLastName(e.target.value) }
          />
        </label>
          </label>
          <label>Last Name<br />
            <input
              type="text"
              placeholder="Last Name"
              id="lastName"
              className="dark"
              onChange={ (e) => setLastName(e.target.value) }
            />
          </label>
        </div>
        <label>Email<br />
          <input
            type="email"
            placeholder="email@example.com"
            id="email"
            className="dark"
            value={email ? email : ''}
            onChange={ (e) => setEmail(e.target.value) }
          />
        </label>
        <div className={styles.buttons}>
          <button
            className={`button button--green ${styles.updateButton} ${saving ? styles.saving : null}`}
            onClick={handleUpdateUser}
          >
            <span>Update User Info</span>
            {saving ? <Loader className={styles.savingLoader} /> : null}
          </button>
          <button
            className="button button--yellow"
            onClick={handleDeleteUser}
          >Delete Account</button>
        </div>
      </div>

      <label className="divider"><span>Brewhouse Settings</span></label>
      <div className={styles.form}>
        <div className={formStyles.row}>
          <label htmlFor="units">Measurement Units<br />
            <select
              name="units"
              className="dark"
              value={settings.units}
              onChange={(e) => setSettings({...settings, units: e.target.value, edited: true})}
            >
              <option value="us">US</option>
              <option value="metric">Metric</option>
            </select>
          </label>
          <label>IBU Calculation Formula<br />
            <select
              name="ibuFormula"
              className="dark"
              value={settings.ibuFormula}
              onChange={(e) => setSettings({...settings, ibuFormula: e.target.value, edited: true})}
            >
              <option value="rager">Rager</option>
              <option value="tinseth">Tinseth</option>
            </select>
          </label>
        </div>
        <p className="light">Dial your brewhouse settings in here over time to pre-populate this data when setting up a brew. Changes will only affect new brews.</p>
        <div className={formStyles.row}>
          <label>
            Kettle Size (gal)&nbsp;
            <Info alignment="top-right" info="Primarily&nbsp;used&nbsp;in BIAB&nbsp;calculations." /><br />
            <input
              type="number"
              placeholder="10"
              step="0.5"
              id="kettle"
              className="dark"
              autoComplete="none"
              value={settings.kettle}
              onChange={(e) => setSettings({
                ...settings,
                kettle: e.target.value !== '' ? Number(e.target.value) : '',
                edited: true
              })}
            />
          </label>
          <label>
            Evaporation Rate (%/hr)&nbsp;
            <Info alignment="top-right" info="For&nbsp;assistance in&nbsp;determining your evap rate, visit&nbsp;our&nbsp;calculators page." /><br />
            <input
              type="number"
              placeholder="1.5"
              id="evapRate"
              className="dark"
              autoComplete="none"
              value={settings.evapRate}
              onChange={(e) => setSettings({
                ...settings,
                evapRate: e.target.value !== '' ? Number(e.target.value) : '',
                edited: true
              })}
            />
          </label>
        </div>
        <div className={formStyles.row}>
          <label>
            Strike Temperature Adjustment Factor&nbsp;
            <Info alignment="top-right" info="Equipment&nbsp;losses. You may need to dial this in over time." /><br />
            <input
              type="number"
              placeholder="0"
              id="strikeFactor"
              className="dark"
              autoComplete="none"
              value={settings.strikeFactor}
              onChange={(e) => setSettings({
                ...settings,
                strikeFactor: e.target.value !== '' ? Number(e.target.value) : '',
                edited: true
              })}
            />
          </label>
        </div>
      </div>

      <label className="divider"><span>Upload Brew (BeerXML)</span></label>
      <div className={`${styles.form} ${formStyles.rowOneThird}`}>
        <input
          type="file"
          id="beerxmlUpload"
          accept=".xml"
          ref={fileInput}
          onChange={fileAdded}
        />
        <label
          className={`dark ${file ? 'filled' : null}`}
          htmlFor="beerxmlUpload"
        >
          {file ? file : 'Choose File'}
        </label>
        <button
          className={`button button--green ${styles.uploadButton} ${uploading ? styles.uploading : null}`}
          onClick={uploadBrews}
          disabled={!file}
        >
          <span>Upload File</span>
          {uploading ? <Loader className={styles.savingLoader} /> : null}
        </button>
      </div>
      <label>NOTE: This upload maps over everything it can form your beerXML files, but it is only as good as the data those files contain. Make sure your files are up to spec. <a href="http://www.beerxml.com/beerxml.htm" target="_blank" rel="noopener noreferrer">beerxml.com</a></label>
    </section>
  );
}

export default Profile;