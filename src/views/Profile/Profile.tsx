import React from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Profile.module.scss';
import formStyles from '../../components/Forms/Forms.module.scss';
import Avatar from '../../components/Avatar/Avatar';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';

class Profile extends React.Component<any, any> {
  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);

    this.state = {
      username: this.props.currentUser.username,
      password1: '',
      password2: '',
      email: this.props.currentUser.email,
      firstName: this.props.currentUser.first_name,
      lastName: this.props.currentUser.last_name,
      error: null,
      uploadSuccess: null,
      uploadError: null,
      saving: false,
      file: null,
      uploading: false,
    }

    this.fileInput = React.createRef();
  }

  componentDidMount() {
    document.title = "BeerForge | Profile";
  }

  dataChanged = (e: any) => {
    const type = e.target.id;
    this.setState({[type]: e.target.value}, () => {
      // Password matching validation for sign up
      if (
        (type === 'password1' || type === 'password2') &&
        this.state.password2 !== '' &&
        this.state.password1 !== this.state.password2
      ) {
        this.setState({error: 'noMatch'});
      } else {
        this.setState({error: null});
      }
    });
  };

  updateUser = async () => {
    try {
      this.setState({saving: true});
      // build our body for the request
      const body = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
      };
      const currentUser = this.props.currentUser;
      const authHeaders = {'authorization': currentUser ? currentUser.token : null};

      const response = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/users/${currentUser.id}`, body, {
        headers: authHeaders,
      });

      this.props.updateUser({currentUser: response.data[0]});
      this.setState({saving: false});
    } catch (error) {
      this.setState({error: error.response.data, saving: false});
    }
  }

  deleteUser = async () => {
    try {
      const currentUser = this.props.currentUser;
      const authHeaders = {'authorization': currentUser ? currentUser.token : null};

      await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/users/${currentUser.id}`, {
        headers: authHeaders,
      });

      this.props.logOutUser();
    } catch (error) {
      this.setState({error: error.response.data});
    }
  }

  handleDeleteUser = () => {
    this.props.modalProps.showModal({
      title: `Are you sure you want to permanently remove your user account?`,
      buttons: <>
          <button
            className="button button--brown"
            onClick={() => this.props.modalProps.hideModal()}
          >No, cancel</button>
          <button
            className="button"
            onClick={() => {
              this.deleteUser();
              this.props.modalProps.hideModal();
            }}
          >Yes, remove</button>
        </>
    });
  }

  fileAdded = (e: any) => {
    let name = null;
    if (
      this.fileInput.current &&
      this.fileInput.current.files &&
      this.fileInput.current.files.length > 0
    ) {
      name = this.fileInput.current.files[0].name;
    }

    this.setState({file: name});
  };

  uploadBrews = async (e: any) => {
    // before we start using the current user, let's just make sure they haven't expired, shall we?
    this.props.loadUser();
    if (
      this.fileInput.current &&
      this.fileInput.current.files &&
      this.fileInput.current.files.length > 0
    ) {
      try {
        this.setState({uploading: true});

        const formData = new FormData();
        formData.append('beerxml', this.fileInput.current.files[0]);
        const currentUser = this.props.currentUser;
        const authHeaders = {
          'authorization': currentUser ? currentUser.token : null,
          'Content-Type': 'multipart/form-data'
        };

        const result = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/brews/upload`, formData, {
          headers: authHeaders,
        });

        if (result.status === 202) {
          this.setState({uploadSuccess: 'Upload success!', uploading: false, file: null});
          this.fileInput.current.value = '';
        }
      } catch (error) {
        this.setState({uploadError: error.response.data, uploading: false, file: null});
        this.fileInput.current.value = '';
      }
    }
  };

  render() {
    const { currentUser } = this.props;

    return (
      <section className={styles.profile}>
        <header>
          <div className={styles.profilePic}>
            <Avatar user={currentUser} />
          </div>
          <h1 className={styles.infoContainer__header}>
            {currentUser.username ? currentUser.username : `${currentUser.first_name} ${currentUser.last_name}`}
            <span>Joined <FormattedDate>{currentUser.date_joined}</FormattedDate></span>
          </h1>
        </header>
        <div className={styles.form}>
          <label>First Name<br />
            <input
              type="text"
              placeholder="First Name"
              id="firstName"
              className="dark"
              value={this.state.firstName ? this.state.firstName : ''}
              onChange={this.dataChanged}
            />
          </label>
          <label>Last Name<br />
            <input
              type="text"
              placeholder="Last Name"
              id="lastName"
              className="dark"
              value={this.state.lastName ? this.state.lastName : ''}
              onChange={this.dataChanged}
            />
          </label>
          <label>Email<br />
            <input
              type="email"
              placeholder="email@example.com"
              id="email"
              className="dark"
              value={this.state.email ? this.state.email : ''}
              onChange={this.dataChanged}
            />
          </label>
          <div className={styles.buttons}>
            <button
              className={`button button--green ${styles.updateButton} ${this.state.saving ? styles.saving : null}`}
              onClick={this.updateUser}
            >
              <span>Update Info</span>
              {this.state.saving ? <Loader className={styles.savingLoader} /> : null}
            </button>
            <button
              className="button button--yellow"
              onClick={this.handleDeleteUser}
            >Delete Account</button>
          </div>
        </div>

        <label className="divider"><span>Upload Brew (BeerXML)</span></label>
        <div className={`${styles.form} ${formStyles.rowOneThird}`}>
          <input
            type="file"
            id="beerxmlUpload"
            accept=".xml"
            ref={this.fileInput}
            onChange={this.fileAdded}
          />
          <label
            className={`dark ${this.state.file ? 'filled' : null}`}
            htmlFor="beerxmlUpload"
          >
            {this.state.file ? this.state.file : 'Choose File'}
          </label>
          <button
            className={`button button--green ${styles.uploadButton} ${this.state.uploading ? styles.uploading : null}`}
            onClick={this.uploadBrews}
            disabled={!this.state.file}
          >
            <span>Upload File</span>
            {this.state.uploading ? <Loader className={styles.savingLoader} /> : null}
          </button>
        </div>
        {this.state.uploadSuccess !== null
          ? <p className="success">{this.state.uploadSuccess}</p>
          : null
        }
        {this.state.uploadError !== null
          ? <p className="error">{this.state.uploadError}</p>
          : null
        }
        <label>NOTE: This upload maps over everything it can form your beerXML files, but it is only as good as the data those files contain. Make sure your files are up to spec. <a href="http://www.beerxml.com/beerxml.htm" target="_blank" rel="noopener noreferrer">beerxml.com</a></label>

          {/* <label className="divider"><span>Brewhouse Settings</span></label>
          <button
            className="button button--yellow"
            // onClick={saveData}
          >Update Settings</button> */}
      </section>
    );
  }
}

export default Profile;