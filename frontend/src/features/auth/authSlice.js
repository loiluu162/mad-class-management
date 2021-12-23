import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../services/api';

import { setMessage } from '../message/messageSlice';

const initialState = {
  user: {},
  loggedIn: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { email, password, name, confirmPassword },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await client.post('/auth/signup', {
        email,
        name,
        password,
        confirmPassword,
      });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ code }, { dispatch, rejectWithValue }) => {
    try {
      const response = await client.post('/auth/verifyEmail', {
        code,
      });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const requestForgotPassword = createAsyncThunk(
  'auth/requestForgotPassword',
  async ({ email }, { dispatch, rejectWithValue }) => {
    try {
      const response = await client.post('/auth/requestForgotPassword', {
        email,
      });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { code, newPassword, confirmNewPassword },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await client.post('/auth/resetPassword', {
        code,
        newPassword,
        confirmNewPassword,
      });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { currentPassword, newPassword, confirmNewPassword },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.post(
        '/auth/changePassword',
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state, action) {
      state.loggedIn = false;
      state.user = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.user = action.payload.content;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.user = action.payload.content;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.user = action.payload.content;
      })
      .addCase(login.rejected, (state, action) => {
        state.loggedIn = false;
        state.user = action.error.message;
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;

export const selectLoggedInStatus = (state) => state.auth.loggedIn;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.user?.accessToken;
export const selectRefreshToken = (state) => state.auth.user?.refreshToken;
