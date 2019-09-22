import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './LoginSignup.module.scss';
import Loader from '../../components/Loader/Loader';
import { useUser } from '../../Store/UserContext';

const LoginSignup = (props: any) => {
  // CONTEXT
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();

  // STATE
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [flip, setFlip] = useState('');
  const [error, setError] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);

  // mount
  useEffect(() => {
    document.title = "BeerForge | Log In or Sign Up";
  }, []);

  useEffect(() => {
    // Password matching validation for sign up
    if ( password2 !== '' && password1 !== password2) {
      setError('noMatch');
    } else {
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password1, password2]);

  const logInOrSignUpUser = async (url: string, body: Object) => {
    try {
      setSaving(true);
      const response = await axios.post(url, body);
      userDispatch({type: 'save', payload: response.data});
      setSaving(false);
      props.history.push('/dashboard');
    } catch (error) {
      setError(error.response.status);
      setSaving(false);
    }
  }

  const handleLogIn = (e: any) => {
    e.preventDefault();
    logInOrSignUpUser(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
      username: username,
      password: password
    });
  }

  const handleSignUp = (e: any) => {
    e.preventDefault();
    if (error !== 'noMatch') {
      logInOrSignUpUser(`${process.env.REACT_APP_API_ENDPOINT}/users`, {
        username: newUsername,
        password1: password1,
        password2: password2,
        email: email,
      });
    }
  }

  const flipStyles = (direction: string) => (event: any) => {
    setFlip(styles[direction]);
  }

  return (
    <section className={styles.loginSignup}>
      <div className={`${styles.container} ${flip}`}>
        <div className={styles.logIn}>
          <h1 className={styles.loginSignup__header}>Log In</h1>
          {
            error === 404 ?
              <p className={`error center-text`}>
                No user with that name found. Please try again.
              </p>
              : null
          }
          {
            error === 401 ?
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
                className={`dark ${error === 404 ? 'error' : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
              />
            </label><br />
            <label className={styles.loginSignup__label}>
              Password<br />
              <input
                type="password"
                name="password"
                className={`dark ${error === 401 ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className={styles.loginSignup__buttons}>
              <button
                type="submit"
                className={`button button--yellow ${styles.loginSignupButton}`}
              >
                <span>Submit</span>
                {saving ? <Loader className={styles.savingLoader} color="#191919" /> : null}
              </button>
              <button
                type="button"
                className="button button--no-button"
                onClick={flipStyles('back')}
              >Sign Up</button>
            </div>
          </form>
        </div>

        <div className={styles.signUp}>
          <h1 className={styles.loginSignup__header}>Sign Up</h1>
          {
            error === 500 ?
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label><br />
            <label className={styles.loginSignup__label}>
              Username<br />
              <input
                type="text"
                name="newUsername"
                className={`dark ${error === 500 ? 'error' : ''}`}
                required
                autoComplete="off"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </label><br />
            <label className={styles.loginSignup__label}>
              Password<br />
              <input
                type="password"
                name="password1"
                required
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className={`dark ${error === 'noMatch' ? 'error' : ''}`}
              />
            </label><br />
            <label className={styles.loginSignup__label}>
              Re-Type Password<br />
              <input
                type="password"
                name="password2"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={`dark ${error === 'noMatch' ? 'error' : ''}`}
              />
            </label><br />
            {
              error === 'noMatch' ?
                <p className="error">Passwords don't match.</p>
                : null
            }
            <div className={styles.loginSignup__buttons}>
              <button
                type="submit"
                className={`button button--yellow ${styles.loginSignupButton}`}
              >
                <span>Submit</span>
                {saving ? <Loader className={styles.savingLoader} color="#191919" /> : null}
              </button>
              <button
                type="button"
                className="button button--no-button"
                onClick={flipStyles('front')}
              >Log In</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginSignup;