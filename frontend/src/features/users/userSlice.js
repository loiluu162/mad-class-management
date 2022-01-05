import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../services/api';
import { setMessage } from '../message/messageSlice';

const initialState = { users: [], status: 'idle', error: null };
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get('/users', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async ({ id }, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const newUser = createAsyncThunk(
  'users/newUser',
  async (
    { email, name, password, confirmPassword },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.post(
        '/users',
        { email, name, password, confirmPassword },
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
export const blockUser = createAsyncThunk(
  'users/blockUser',
  async (body, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.post('/users/block', body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(fetchUser({ id: body.userId }));
      dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.content;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.users = [];
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const foundIndex = state.users.findIndex(
          (item) => item.id === Number.parseInt(action.payload.content.id)
        );
        state.users[foundIndex] = {
          ...state.users[foundIndex],
          ...action.payload.content,
        };
      });
  },
});

export default userSlice.reducer;

// export const { setMessage, clearMessage } = userSlice.actions;

export const selectAllUsers = (state) => state.users.users;
