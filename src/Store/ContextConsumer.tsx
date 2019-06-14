import React from 'react';
import {BrewContext} from './BrewProvider';
import {UserContext} from './UserProvider';

export default class ContextConsumer extends React.Component {
  render() {
    const {children} = this.props;

    return (
      <UserContext.Consumer>
        {
          // @ts-ignore-line
          ({currentUser, saveUser, loadUser, logOutUser}) => (
          <BrewContext.Consumer>
            {
              // @ts-ignore-line
              ({brew, updateBrew, saveBrewToDB, updateBrewOnDB, getBrewfromDB, clearBrew}) => {
                return React.Children.map(children, child =>
                  // @ts-ignore-line
                  React.cloneElement(child, {
                    brew,
                    updateBrew,
                    saveBrewToDB,
                    updateBrewOnDB,
                    getBrewfromDB,
                    clearBrew,
                    currentUser,
                    saveUser,
                    loadUser,
                    logOutUser,
                  })
                );
              }
            }
          </BrewContext.Consumer>
          )
        }
      </UserContext.Consumer>
    );
  }
}