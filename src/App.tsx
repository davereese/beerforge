import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Fade from './components/Fade/Fade';
import Dashboard from './views/Dashborad/Dashboard';
import LoginSignup from './views/LoginSignup/LoginSignup';

// Check for logged in user
// @ts-ignore-line
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentUser: currentUser,
    }
  }

  render() {
    const handleLogIn = (response: any) => {
      this.setState({currentUser: response});
      localStorage.setItem('currentUser', JSON.stringify(response));
    }

    const handleLogOut = () => {
      this.setState({currentUser: null});
      localStorage.removeItem('currentUser');
    }

    return (
      <Fade>
        <Header user={this.state.currentUser} onLogout={handleLogOut} />
        <main>
          <Switch>
            {/* <Route path="/" exact component={Home} /> */}
            <Route path="/dashboard" exact render={props => (
              <Dashboard {...props} user={this.state.currentUser} />
            )} />
            <Route path="/login" exact render={props => (
              <LoginSignup
                onLoginSuccess={handleLogIn}
                onSignupSuccess={handleLogIn}
                history={props.history}
              />
            )} />
            {/* <Route component={NoMatch} /> */}
          </Switch>
        </main>
        <Footer />
      </Fade>
    );
  }
}

export default App;
