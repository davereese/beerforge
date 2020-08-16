import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import UserProvider from './store/UserContext';
import BrewProvider from './store/BrewContext';
import ModalProvider from './store/ModalContext';
import SnackbarProvider from './store/SnackbarContext';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <ModalProvider>
        <SnackbarProvider>
          <BrewProvider>
            <App />
          </BrewProvider>
        </SnackbarProvider>
      </ModalProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
