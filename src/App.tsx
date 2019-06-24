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
import { BrewInterface } from './Store/BrewProvider';
import { UserInterface } from './Store/UserProvider';
import { isEmpty } from './resources/javascript/isEmpty';
import Brews from './views/Brews/Brews';
import Calculators from './views/Calculators/Calculators';
import NoMatch from './views/404/NoMatch';

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
  modalProps: any;
}

class App extends React.Component<any, Props> {
  componentDidMount() {
    if (isEmpty(this.props.currentUser)) {
      this.props.history.push('/login');
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (!isEmpty(prevProps.currentUser) && isEmpty(this.props.currentUser)) {
      this.props.history.push('/login');
    }
  };

  render() {
    return (
      <Fade>
        <Header {...this.props} />
        <main>
          <Switch>
            {/* <Route path="/" exact component={Home} /> */}
            <Route path="/dashboard" exact render={props => (
              <Dashboard {...{props}} {...this.props} />
            )} />
            <Route path="/login" exact render={props => (
              <LoginSignup {...this.props} history={props.history} />
            )} />
            <Route path="/brew" render={props => (
              <Brew {...{props}} {...this.props} />
            )} />
            <Route path="/brews" render={props => (
              <Brews {...{props}} {...this.props} />
            )} />
            <Route path="/profile" render={props => (
              <Profile {...{props}} {...this.props} />
            )} />
            <Route path="/calculators" render={props => (
              <Calculators {...{props}} {...this.props} />
            )} />
            <Route component={NoMatch} />
          </Switch>
        </main>
        <Modal modalProps={this.props.modalProps} />
        <Footer {...this.props} />
      </Fade>
    );
  }
}

export default withRouter(App);
