import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppStore from './Stores/AppStore';
import App from './App';

const appStore = new AppStore();

render(
  <AppContainer>
    <App appStore={appStore} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    render(
      <AppContainer>
        <NextApp appStore={appStore} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
