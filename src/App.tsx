import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import styles from './App.module.scss';
import Header from './components/Header/Header';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Header/>
        <main>
          <Switch>
            {/* <Route path="/" exact component={Dashboard} />
            <Route component={NoMatch} /> */}
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
