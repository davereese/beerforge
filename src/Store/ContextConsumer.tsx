import React from 'react';

import { BrewContext } from './BrewProvider';
import { UserContext } from './UserProvider';
import { ModalContext } from './ModalProvider';
import { SnackbarContext } from './SnackbarProvider';

export default class ContextConsumer extends React.Component {
  render() {
    const {children} = this.props;

    return (
      <UserContext.Consumer>
        {
          // @ts-ignore-line
          ({currentUser, saveUser, loadUser, updateUser, logOutUser}) => (
            <ModalContext.Consumer>
              {
                (modalProps) => (
                  <SnackbarContext.Consumer>
                    {
                      (snackbarProps) => (
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
                                  updateUser,
                                  loadUser,
                                  logOutUser,
                                  modalProps,
                                  snackbarProps
                                })
                              );
                            }
                          }
                        </BrewContext.Consumer>
                      )
                    }
                  </SnackbarContext.Consumer>
                )
              }
            </ModalContext.Consumer>
          )
        }
      </UserContext.Consumer>
    );
  }
}