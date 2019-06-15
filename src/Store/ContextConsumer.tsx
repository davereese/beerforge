import React from 'react';

import { BrewContext } from './BrewProvider';
import { UserContext } from './UserProvider';
import { ModalContext } from './ModalProvider';

export default class ContextConsumer extends React.Component {
  render() {
    const {children} = this.props;

    return (
      <UserContext.Consumer>
        {
          // @ts-ignore-line
          ({currentUser, saveUser, loadUser, logOutUser}) => (
            <ModalContext.Consumer>
              {
                (modalProps) => (
                  <BrewContext.Consumer>
                    {
                      // @ts-ignore-line
                      ({brew, updateBrew, saveBrewToDB, updateBrewOnDB, getBrewfromDB, deleteBrewFromDB, clearBrew}) => {
                        return React.Children.map(children, child =>
                          // @ts-ignore-line
                          React.cloneElement(child, {
                            brew,
                            updateBrew,
                            saveBrewToDB,
                            updateBrewOnDB,
                            getBrewfromDB,
                            deleteBrewFromDB,
                            clearBrew,
                            currentUser,
                            saveUser,
                            loadUser,
                            logOutUser,
                            modalProps
                          })
                        );
                      }
                    }
                  </BrewContext.Consumer>
                )
              }
            </ModalContext.Consumer>
          )
        }
      </UserContext.Consumer>
    );
  }
}