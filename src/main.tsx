import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { OnboardProvider } from '@sovryn/onboard-react';
import { App } from './App';
import { persistor, store } from './store';
import { ThemeProvider } from './theme';
import { AppUpdater } from './store/app/app.updaters';
import { WalletConnectionChecker } from './components/WalletConnectionChecker/WalletConnectionChecker.component';

if ('ethereum' in window) {
  // @ts-ignore
  window.ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <WalletConnectionChecker>
              <AppUpdater />
              <OnboardProvider dataAttribute="dapp-onboard" />
              <App />
            </WalletConnectionChecker>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
