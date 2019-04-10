import React, { ChangeEvent, FormEvent } from 'react';

import styles from './LoginSignup.module.scss';

class LoginSignup extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  componentDidMount() {
    document.title = "BeerForge | Log In";
  }

  render() {
    const handleChange = (e: any): void => {
      console.log(e.target);
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const handleSubmit = (e: any): void => {
      e.preventDefault();
    }

    return (
      <section className={styles.loginSignup}>
        <div className={styles.signin}>
          <h1 className={styles.loginSignup__header}>Log In</h1>
          <form onSubmit={handleSubmit}>
            <label className={styles.loginSignup__label}>
              Username<br />
              <input
                type="text"
                name="username"
                className="dark"
                value={this.state.username}
                onChange={handleChange}
              />
            </label><br />
            <label className={styles.loginSignup__label}>
              Password<br />
              <input
                type="password"
                name="password"
                className="dark"
                value={this.state.password}
                onChange={handleChange}
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
              >
              Sign Up
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default LoginSignup;