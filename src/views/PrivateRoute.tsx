import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useUser } from '../store/UserContext';

interface Props {
  component: Function,
  path: string;
}

const PrivateRoute = ({
  component: Component,
  path,
  ...rest
}: Props) => {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  
  return (
    <Route
      exact
      render={props => {
        // if user is not authenticated, save the url for forwarding
        if (user) {
          localStorage.setItem(
            "entryUrl",
            window.location.pathname + window.location.search
          );
        }

        return user ? (
          <React.Fragment>
            <Component {...props} currentUser={user} {...rest} />
          </React.Fragment>
        ) : <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
      }}
    />
  );
};

export default PrivateRoute;