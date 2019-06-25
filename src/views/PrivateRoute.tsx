import React from "react";
import { Route, Redirect } from "react-router-dom";

interface Props {
  component: Function,
  path: string;
  currentUser?: any,
}

const PrivateRoute = ({
  component: Component,
  currentUser,
  path,
  ...rest
}: Props) => (
  <Route
    exact
    // {...rest}
    render={props => {
      // if user is not authenticated, save the url for forwarding
      if (currentUser) {
        localStorage.setItem(
          "entryUrl",
          window.location.pathname + window.location.search
        );
      }

      return currentUser ? (
        <React.Fragment>
          <Component {...props} currentUser={currentUser} {...rest} />
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

export default PrivateRoute;