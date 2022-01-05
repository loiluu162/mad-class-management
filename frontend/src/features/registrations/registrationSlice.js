import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../services/api';
const initialState = {
  registrations: [],
  status: 'idle',
  error: null,
};

export const fetchRegistrations = createAsyncThunk(
  'registrations/fetchRegistration',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get('/registrations', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      // dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const fetchMyRegistrations = createAsyncThunk(
  'registrations/fetchMyRegistrations',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get('/registrations/my', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      // dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);

export const changeRegStatus = createAsyncThunk(
  'registrations/changeRegStatus',
  async (
    { status, userId, classId },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.put(
        '/registrations/changeStatus',
        { status, userId, classId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // dispatch(setMessage(response.message));
      dispatch(regStatusUpdated({ status, userId, classId }));

      return response;
    } catch (error) {
      // dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const cancelRegistration = createAsyncThunk(
  'classes/cancelRegistration',
  async ({ classId }, { dispatch, rejectWithValue, getState }) => {
    const { accessToken = null } = getState().auth.user;

    const response = await client.post(
      '/registrations/cancel',
      {
        classId,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    dispatch(fetchMyRegistrations());
    return response;
  }
);
const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    regStatusUpdated(state, action) {
      const { status, userId, classId } = action.payload;
      const foundIndex = state.registrations.findIndex(
        (item) =>
          item.userId === Number.parseInt(userId) &&
          item.classId === Number.parseInt(classId)
      );
      if (foundIndex === -1) return;
      state.registrations[foundIndex] = {
        ...state.registrations[foundIndex],
        status,
      };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchRegistrations.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registrations = action.payload.content;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.status = 'fail';
        state.registrations = [];
      })
      .addCase(fetchMyRegistrations.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMyRegistrations.rejected, (state, action) => {
        state.status = 'fail';
        state.registrations = [];
      })
      .addCase(fetchMyRegistrations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registrations = action.payload.content;
      });
  },
});

export default registrationsSlice.reducer;
export const { regStatusUpdated } = registrationsSlice.actions;

export const selectAllRegistrations = (state) =>
  state.registrations.registrations;
