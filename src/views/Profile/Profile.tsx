import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './Profile.module.scss';
import formStyles from '../../components/Forms/Forms.module.scss';
import Avatar from '../../components/Avatar/Avatar';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';
import { useUser } from '../../Store/UserContext';
import { useModal } from '../../Store/ModalContext';
import { SnackbarProviderInterface } from '../../Store/SnackbarProvider';

interface Props {
  snackbarProps: SnackbarProviderInterface;
}

const Profile = (props: Props) => {
  const fileInput = React.createRef<HTMLInputElement>();
  const [user, userDispatch] = useUser();
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();
  // const [password, setPassword] = useState('');
  // const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.title = "BeerForge | Profile";
  }, [])

  const updateUser = async () => {
    try {
      setSaving(true);
      // build our body for the request
      const body = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      const authHeaders = {'authorization': user ? user.token : null};

      const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/users/${user.id}`, body, {
        headers: authHeaders,
      });

      userDispatch({type: 'update', payload: res.data[0]});
      setSaving(false);
      props.snackbarProps.showSnackbar({
        status: 'success',
        message: 'Profile updated',
      });
    } catch (error) {
      setSaving(false);
      props.snackbarProps.showSnackbar({
        status: 'error',
        message: error.message,
      });
    }
  }

  const deleteUser = async () => {
    try {
      const authHeaders = {'authorization': user ? user.token : null};

      await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/users/${user.id}`, {
        headers: authHeaders,
      });
      props.snackbarProps.showSnackbar({
        status: 'success',
        message: 'Account deleted',
      });
      userDispatch({type: 'logout'});
    } catch (error) {
      props.snackbarProps.showSnackbar({
        status: 'error',
        message: error.message,
      });
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
          fileInput.current.value = '';
          props.snackbarProps.showSnackbar({
            status: 'success',
            message: 'Upload success!',
          });
        }
      } catch (error) {
        setUploading(false);
        setFile('');
        fileInput.current.value = '';
        props.snackbarProps.showSnackbar({
          status: 'error',
          message: error.message,
        });
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
      <div className={styles.form}>
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
            onClick={updateUser}
          >
            <span>Update Info</span>
            {saving ? <Loader className={styles.savingLoader} /> : null}
          </button>
          <button
            className="button button--yellow"
            onClick={handleDeleteUser}
          >Delete Account</button>
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

        {/* <label className="divider"><span>Brewhouse Settings</span></label>
        <button
          className="button button--yellow"
          // onClick={saveData}
        >Update Settings</button> */}
    </section>
  );
}

export default Profile;