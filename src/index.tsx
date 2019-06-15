import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import UserProvider from './Store/UserProvider';
import BrewProvider from './Store/BrewProvider';
import ContentConsumer from './Store/ContextConsumer';
import ModalProvider from './Store/ModalProvider';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <ModalProvider>
        <BrewProvider>
          <ContentConsumer>
            <App />
          </ContentConsumer>
        </BrewProvider>
      </ModalProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
