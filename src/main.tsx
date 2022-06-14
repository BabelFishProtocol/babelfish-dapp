// import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { PersistGate } from 'redux-persist/integration/react';

import { App } from './App';
import { persistor, store } from './store';
import { ThemeProvider } from './theme';
import { AppUpdater } from './store/app/app.updaters';
import { WalletConnectionChecker } from './components/WalletConnectionChecker/WalletConnectionChecker.component';

if ('ethereum' in window) {
  // @ts-ignore
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const getLibrary = (provider: ExternalProvider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;

  return library;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <Web3ReactProvider getLibrary={getLibrary}>
              <WalletConnectionChecker>
                <AppUpdater />
                <App />
              </WalletConnectionChecker>
            </Web3ReactProvider>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
