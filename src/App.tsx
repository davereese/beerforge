import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Dashboard from './views/Dashborad/Dashboard';
import Fade from './components/Fade/Fade';

class App extends React.Component {
  render() {
    return (
      <Fade>
        <Header/>
          <main>
            <Switch>
              <Route path="/" exact component={Dashboard}/>
              {/* <Route component={NoMatch} /> */}
            </Switch>
          </main>
        <Footer/>
      </Fade>
    );
  }
}

export default App;
