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

interface Props extends RouteComponentProps {
  history: any;
}

const App = (props: Props) => {
  return (
    <Fade>
      {window.location.pathname !== '/' ? <Header {...props} /> : null}
      <main>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact render={props => (
            <LoginSignup {...props} history={props.history} />
          )} />
          <Route path="/calculators" render={props => (
            <Calculators {...{props}} {...props} />
          )} />
          <PrivateRoute
            {...props}
            path="/dashboard"
            component={Dashboard}
          />
          <PrivateRoute
            {...props}
            path="/user/:userId/brews"
            component={Brews}
          />
          <PrivateRoute
            {...props}
            path="/user"
            component={Dashboard}
          />
          <PrivateRoute
            {...props}
            path="/brew"
            component={Brew}
          />
          <PrivateRoute
            {...props}
            path="/brews"
            component={Brews}
          />
          <PrivateRoute
            {...props}
            path="/profile"
            component={Profile}
          />
          <Route component={NoMatch} />
        </Switch>
      </main>
      <Modal />
      <Snackbar />
      <Footer />
    </Fade>
  );
}

export default withRouter(App);
