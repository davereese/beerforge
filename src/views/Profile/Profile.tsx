import React from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Profile.module.scss';
import Avatar from '../../components/Avatar/Avatar';
import FormattedDate from '../../components/FormattedDate/FormattedDate';
import Loader from '../../components/Loader/Loader';

class Profile extends React.Component<any, any> {
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
      saving: false,
    }
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

      const response = await axios.put(`http://localhost:4000/api/users/${currentUser.id}`, body, {
        headers: authHeaders,
      });

      this.props.updateUser({currentUser: response.data[0]});
      this.setState({saving: false});
    } catch (error) {
      this.setState({error: error.response.status, saving: false});
    }
  }

  deleteUser = async () => {
    try {
      const currentUser = this.props.currentUser;
      const authHeaders = {'authorization': currentUser ? currentUser.token : null};

      await axios.delete(`http://localhost:4000/api/users/${currentUser.id}`, {
        headers: authHeaders,
      });

      this.props.logOutUser();
    } catch (error) {
      this.setState({error: error.response.status});
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

          {/* <label className="divider"><span>Brewhouse Settings</span></label>
          <button
            className="button button--yellow"
            // onClick={saveData}
          >Update Settings</button> */}
        </div>
      </section>
    );
  }
}

export default Profile;