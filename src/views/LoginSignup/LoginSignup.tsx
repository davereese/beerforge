import React from 'react';
import axios from 'axios';

import styles from './LoginSignup.module.scss';

class LoginSignup extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password1: '',
      password2: '',
      email: '',
      newUsername: '',
      flip: '',
      error: '',
    }
  }

  componentDidMount() {
    document.title = "BeerForge | Log In";
  }

  async logInOrSignUpUser(url: string, body: Object) {
    try {
      const response = await axios.post(url, body);
      this.props.onLoginSuccess(response.data);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({error: error.response.status});
    }
  }

  render() {
    const handleChange = (e: any): void => {
      const type = e.target.name;
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
    }

    const handleLogIn = (e: any): void => {
      e.preventDefault();
      this.logInOrSignUpUser('http://localhost:4000/api/login', {
        username: this.state.username,
        password: this.state.password
      });
    }

    const handleSignUp = (e: any): void => {
      e.preventDefault();
      this.logInOrSignUpUser('http://localhost:4000/api/users', {
        username: this.state.newUsername,
        password: this.state.password1,
        email: this.state.email,
      });
    }

    return (
      <section className={styles.loginSignup}>
        <div className={`${styles.container} ${this.state.flip}`}>
          <div className={styles.logIn}>
            <h1 className={styles.loginSignup__header}>Log In</h1>
            {
              this.state.error === 404 ?
                <p className={`error center-text`}>
                  No user with that name found. Please try again.
                </p>
                : null
            }
            {
              this.state.error === 401 ?
                <p className={`error center-text`}>
                  Incorrect password. Please try again.
                </p>
                : null
            }
            <form onSubmit={handleLogIn}>
              <label className={styles.loginSignup__label}>
                Username<br />
                <input
                  type="text"
                  name="username"
                  className={`dark ${this.state.error === 404 ? 'error' : ''}`}
                  value={this.state.username}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </label><br />
              <label className={styles.loginSignup__label}>
                Password<br />
                <input
                  type="password"
                  name="password"
                  className={`dark ${this.state.error === 401 ? 'error' : ''}`}
                  value={this.state.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className={styles.loginSignup__buttons}>
                <input
                  type="submit"
                  value="Submit"
                  className="button button--yellow"
                />
                <button
                  type="button"
                  className="button button--no-button"
                  onClick={() => {this.setState({flip: styles.back})}}
                >
                Sign Up
                </button>
              </div>
            </form>
          </div>

          <div className={styles.signUp}>
            <h1 className={styles.loginSignup__header}>Sign Up</h1>
            {
              this.state.error === 500 ?
                <p className={`error center-text`}>
                  That username already exists. Please try something different.
                </p>
                : null
            }
            <form onSubmit={handleSignUp}>
              <label className={styles.loginSignup__label}>
                Email<br />
                <input
                  type="email"
                  name="email"
                  className="dark"
                  required
                  autoComplete="off"
                  value={this.state.email}
                  onChange={handleChange}
                />
              </label><br />
              <label className={styles.loginSignup__label}>
                Username<br />
                <input
                  type="text"
                  name="newUsername"
                  className={`dark ${this.state.error === 500 ? 'error' : ''}`}
                  required
                  autoComplete="off"
                  value={this.state.newUsername}
                  onChange={handleChange}
                />
              </label><br />
              <label className={styles.loginSignup__label}>
                Password<br />
                <input
                  type="password"
                  name="password1"
                  required
                  value={this.state.password1}
                  onChange={handleChange}
                  className={`dark ${this.state.error === 'noMatch' ? 'error' : ''}`}
                />
              </label><br />
              <label className={styles.loginSignup__label}>
                Re-Type Password<br />
                <input
                  type="password"
                  name="password2"
                  required
                  value={this.state.password2}
                  onChange={handleChange}
                  className={`dark ${this.state.error === 'noMatch' ? 'error' : ''}`}
                />
              </label><br />
              {
                this.state.error === 'noMatch' ?
                  <p className="error">Passwords don't match.</p>
                  : null
              }
              <div className={styles.loginSignup__buttons}>
                <input
                  type="submit"
                  value="Submit"
                  className="button button--yellow"
                />
                <button
                  type="button"
                  className="button button--no-button"
                  onClick={() => {this.setState({flip: styles.front})}}
                >
                Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default LoginSignup;