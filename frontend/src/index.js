import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// import { AuthProvider } from './lib/hooks';
import setupInterceptors from './services/axios.interceptor';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
// setupInterceptors(store);
