import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Fade from './components/Fade/Fade';
import Dashboard from './views/Dashborad/Dashboard';
import LoginSignup from './views/LoginSignup/LoginSignup';

class App extends React.Component {
  render() {
    return (
      <Fade>
        <Header/>
          <main>
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/login" exact component={LoginSignup} />
              {/* <Route component={NoMatch} /> */}
            </Switch>
          </main>
        <Footer/>
      </Fade>
    );
  }
}

export default App;
