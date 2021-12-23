import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';

import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persister = persistStore(store);

// eslint-disable-next-line import/no-anonymous-default-export
export default { store, persister };
