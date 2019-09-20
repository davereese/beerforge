import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Fade from './components/Fade/Fade';
import Dashboard from './views/Dashborad/Dashboard';
import LoginSignup from './views/LoginSignup/LoginSignup';
import Brew from './views/Brew/Brew';
import Modal from './components/Modal/Modal';
import Profile from './views/Profile/Profile';
import Brews from './views/Brews/Brews';
import Calculators from './views/Calculators/Calculators';
import NoMatch from './views/404/NoMatch';
import PrivateRoute from './views/PrivateRoute';
import Home from './views/Home/Home';
import Snackbar from './components/Snackbar/Snackbar';
import { BrewInterface } from './Store/BrewProvider';
import { UserInterface } from './Store/UserContext';

interface Props extends RouteComponentProps {
  currentUser: UserInterface;
  loadUser: Function;
  updateUser: Function;
  saveUser: Function;
  logOutUser: Function;
  brew: BrewInterface;
  clearBrew: Function;
  getBrewfromDB: Function;
  saveBrewToDB: Function;
  updateBrew: Function;
  updateBrewOnDB: Function;
  deleteBrewFromDB: Function;
  history: any;
}

class App extends React.Component<any, Props> {
  render() {
    return (
      <Fade>
        {window.location.pathname !== '/' ? <Header {...this.props} /> : null}
        <main> 
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact render={props => (
              <LoginSignup {...this.props} history={props.history} />
            )} />
            <Route path="/calculators" render={props => (
              <Calculators {...{props}} {...this.props} />
            )} />
            <PrivateRoute
              {...this.props}
              path="/dashboard"
              component={Dashboard}
            />
            <PrivateRoute
              {...this.props}
              path="/brew"
              component={Brew}
            />
            <PrivateRoute
              {...this.props}
              path="/brews"
              component={Brews}
            />
            <PrivateRoute
              {...this.props}
              path="/profile"
              component={Profile}
            />
            <Route component={NoMatch} />
          </Switch>
        </main>
        <Modal />
        <Snackbar snackbarProps={this.props.snackbarProps} />
        <Footer />
      </Fade>
    );
  }
}

export default withRouter(App);
