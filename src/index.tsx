import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import BrewProvider from './Store/BrewProvider';
import ContextConsumer from './Store/ContextConsumer';
import SnackberProvider from './Store/SnackbarProvider';
import UserProvider from './Store/UserContext';
import ModalProvider from './Store/ModalContext';
import SnackbarProvider2 from './Store/SnackbarContext';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <ModalProvider>
        <SnackbarProvider2>
          <SnackberProvider>
            <BrewProvider>
              <ContextConsumer>
                <App />
              </ContextConsumer>
            </BrewProvider>
          </SnackberProvider>
        </SnackbarProvider2>
      </ModalProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
