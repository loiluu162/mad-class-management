import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// import counterReducer from '../features/counter/counterSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import authReducer from '../features/auth/authSlice';
import messageReducer from '../features/message/messageSlice';
import classReducer from '../features/classes/classSlice';
import registrationReducer from '../features/registrations/registrationSlice';
const reducers = combineReducers({
  auth: authReducer,
  message: messageReducer,
  classes: classReducer,
  registrations: registrationReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
export const persistor = persistStore(store);

// eslint-disable-next-line import/no-anonymous-default-export
