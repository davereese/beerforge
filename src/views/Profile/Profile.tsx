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
import { gal2l, l2gal } from '../../resources/javascript/calculator';

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
    strikeFactor: user.strike_adjustment ? user.strike_adjustment : '',
    trubLoss: user.trub_loss ? user.trub_loss : 0.5,
    equipmentLoss: user.equipment_loss ? user.equipment_loss : 1,
    absorptionRate: user.absorption_rate ? user.absorption_rate : 0.125,
    hopAbsorptionRate: user.hop_absorption_rate ? user.hop_absorption_rate : 0.0365,
    boilTemp: user.boil_temp ? user.boil_temp : 210,
    mashEfficiency: user.mash_efficiency ? user.mash_efficiency : '',
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
        <div className={formStyles.row}>
          <label>First Name<br />
            <input
              type="text"
              placeholder="First Name"
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

      <label className="divider"><span id="settings">Brewhouse Settings</span></label>
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
        <p className="light">Pre-populate this data when setting up a brew. Changes will only affect new brews.</p>
        <div className={formStyles.row}>
          <label>
            Kettle Size ({settings.units === 'metric' ? 'L' : 'gal'})&nbsp;
            <Info alignment="top-left" info="Primarily&nbsp;used&nbsp;in BIAB&nbsp;calculations." /><br />
            <input
              type="number"
              placeholder={settings.units === 'metric' ? '37.8' : '10'}
              step="0.5"
              id="kettle"
              className="dark"
              autoComplete="none"
              value={settings.units === 'metric' ? parseFloat(gal2l(settings.kettle).toFixed(5)) : settings.kettle}
              onChange={(e) => setSettings({
                ...settings,
                kettle: e.target.value !== ''
                  ? settings.units === 'metric' ? l2gal(Number(e.target.value)) : Number(e.target.value)
                  : '',
                edited: true
              })}
            />
          </label>
          <label>
            Mash Efficiency (%)&nbsp;
            <Info alignment="top-right" info="For&nbsp;assistance&nbsp;in determining your mash efficiency, visit&nbsp;our&nbsp;calculators page." /><br />
            <input
              type="number"
              placeholder="78"
              id="mashEfficiency"
              className="dark"
              autoComplete="none"
              value={settings.mashEfficiency}
              onChange={(e) => setSettings({
                ...settings,
                mashEfficiency: e.target.value !== '' ? Number(e.target.value) : '',
                edited: true
              })}
            />
          </label>
        </div>
        <div className={formStyles.row}>
          <label>
            Evaporation Rate (%/hr)&nbsp;
            <Info alignment="top-left" info="For&nbsp;assistance in&nbsp;determining your evap rate, visit&nbsp;our&nbsp;calculators page." /><br />
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
          <label>
            Boil Temperature&nbsp;
            <Info alignment="top-right" info="The&nbsp;point&nbsp;at&nbsp;which water boils is dependant on altitude and atmospheric pressure." /><br />
            <input
              type="number"
              placeholder="210"
              id="boilTemp"
              className="dark"
              autoComplete="none"
              value={settings.boilTemp}
              onChange={(e) => setSettings({
                ...settings,
                boilTemp: e.target.value !== '' ? Number(e.target.value) : '',
                edited: true
              })}
            />
          </label>
        </div>
        <p className="light">Dial your brewhouse settings in here over time to fine-tune BeerForge's calculations on your system.</p>
        <div className={formStyles.row}>
          <label>
            Trub Loss ({settings.units === 'metric' ? 'L' : 'gal'})&nbsp;
            <Info
              alignment="top-left"
              info={`Volume\u00A0of\u00A0uncollectable wort due to heavy trub material. Default is\u00A0${settings.units === 'metric' ? parseFloat(gal2l(0.5).toFixed(5))+'\u00A0L' : '0.5\u00A0gal'}.`}
            /><br />
            <input
              type="number"
              placeholder="0.5"
              id="trubLoss"
              className="dark"
              autoComplete="none"
              value={settings.units === 'metric' ? parseFloat(gal2l(settings.trubLoss).toFixed(5)) : settings.trubLoss}
              onChange={(e) => setSettings({
                ...settings,
                trubLoss: e.target.value !== ''
                  ? settings.units === 'metric' ? l2gal(Number(e.target.value)) : Number(e.target.value)
                  : '',
                edited: true
              })}
            />
          </label>
          <label>
            Equipment Loss ({settings.units === 'metric' ? 'L' : 'gal'})&nbsp;
            <Info
              alignment="top-right"
              info={`Volume\u00A0of\u00A0wort\u00A0lost by your system (due to false bottom, etc.). Default\u00A0is\u00A0${settings.units === 'metric' ? parseFloat(gal2l(1).toFixed(5))+'\u00A0L' : '1\u00A0gal'}.`}
            /><br />
            <input
              type="number"
              placeholder="1"
              id="equipmentLoss"
              className="dark"
              autoComplete="none"
              value={settings.units === 'metric' ? parseFloat(gal2l(settings.equipmentLoss).toFixed(5)) : settings.equipmentLoss}
              onChange={(e) => setSettings({
                ...settings,
                equipmentLoss: e.target.value !== ''
                  ? settings.units === 'metric' ? l2gal(Number(e.target.value)) : Number(e.target.value)
                  : '',
                edited: true
              })}
            />
          </label>
        </div>
        <div className={formStyles.row}>
          <label>
            Absorption Rate ({settings.units === 'metric' ? 'L/kg of grain' : 'gal/lb of grain'})&nbsp;
            <Info
              alignment="top-left"
              info={`Volume\u00A0of\u00A0wort absorbed by grains. The default\u00A0is\u00A0${settings.units === 'metric' ? parseFloat(gal2l(0.125).toFixed(5))+'\u00A0L' : '0.125\u00A0gal'}.`}
            /><br />
            <input
              type="number"
              placeholder="0.125"
              id="absorptionRate"
              className="dark"
              autoComplete="none"
              value={settings.units === 'metric' ? parseFloat(gal2l(settings.absorptionRate).toFixed(5)) : settings.absorptionRate}
              onChange={(e) => setSettings({
                ...settings,
                absorptionRate: e.target.value !== ''
                  ? settings.units === 'metric' ? l2gal(Number(e.target.value)) : Number(e.target.value)
                  : '',
                edited: true
              })}
            />
          </label>
          <label>
            Hop Absorption Rate ({settings.units === 'metric' ? 'L/g' : 'gal/oz'})&nbsp;
            <Info
              alignment="top-right"
              info={`Volume\u00A0of\u00A0wort absorbed by hops. The\u00A0default\u00A0is\u00A0${settings.units === 'metric' ? parseFloat(gal2l(0.0365).toFixed(5))+'\u00A0L' : '0.0365\u00A0gal'}.`}
            /><br />
            <input
              type="number"
              placeholder="0.0365"
              id="hopAbsorptionRate"
              className="dark"
              autoComplete="none"
              value={settings.units === 'metric' ? parseFloat(gal2l(settings.hopAbsorptionRate).toFixed(5)) : settings.hopAbsorptionRate}
              onChange={(e) => setSettings({
                ...settings,
                hopAbsorptionRate: e.target.value !== ''
                  ? settings.units === 'metric' ? l2gal(Number(e.target.value)) : Number(e.target.value)
                  : '',
                edited: true
              })}
            />
          </label>
        </div>
        <div className={formStyles.row}>
          <label>
            Strike Temperature Adjustment Factor&nbsp;
            <Info alignment="top-left" info="Temperature&nbsp;losses due to equipment and environment temps. You may need to dial this in over time." /><br />
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