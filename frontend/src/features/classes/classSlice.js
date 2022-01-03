import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../services/api';
const initialState = {
  classes: [],
  status: 'idle',
  error: null,
};

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get(
        '/classes',

        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      // dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const fetchClassesWithMyStatus = createAsyncThunk(
  'classes/fetchClassesWithMyStatus',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get(
        '/classes/my',

        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // dispatch(setMessage(response.message));
      return response;
    } catch (error) {
      // dispatch(setMessage(error.error));
      return rejectWithValue();
    }
  }
);
export const refetchClass = createAsyncThunk(
  'classes/refetchClass',
  async ({ id }, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get(`/classes/${id}`, {
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
export const refetchClassWithStatus = createAsyncThunk(
  'classes/refetchClassWithStatus',
  async ({ id }, { dispatch, rejectWithValue, getState }) => {
    try {
      const { accessToken = null } = getState().auth.user;
      const response = await client.get(`/classes/my/${id}`, {
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

export const addNewClass = createAsyncThunk(
  'classes/addNewClass',
  async (
    { name, startDate, endDate, maxStudents, studyTimes },
    { dispatch, rejectWithValue, getState }
  ) => {
    const { accessToken = null } = getState().auth.user;

    const response = await client.post(
      '/classes',
      {
        name,
        startDate,
        endDate,
        maxStudents,
        studyTimes,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response;
  }
);
export const registerClass = createAsyncThunk(
  'classes/registerClass',
  async ({ classId }, { dispatch, rejectWithValue, getState }) => {
    const { accessToken = null } = getState().auth.user;

    const response = await client.post(
      '/registrations',
      {
        classId,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    dispatch(refetchClassWithStatus({ id: classId }));
    return response;
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
    dispatch(refetchClassWithStatus({ id: classId }));
    return response;
  }
);
export const classUpdate = createAsyncThunk(
  'classes/updateClass',
  async (
    { id, name, startDate, endDate, maxStudents, studyTimes },
    { dispatch, rejectWithValue, getState }
  ) => {
    const { accessToken = null } = getState().auth.user;

    const response = await client.put(
      `/classes/${id}`,
      {
        id,
        name,
        startDate,
        endDate,
        maxStudents,
        studyTimes,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    dispatch(refetchClass({ id }));
    return response;
  }
);
export const deleteStudyTime = createAsyncThunk(
  'classes/deleteStudyTime',
  async ({ id, classId }, { dispatch, rejectWithValue, getState }) => {
    const { accessToken = null } = getState().auth.user;
    const response = await client.delete(`/classes/deleteStudyTime/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(refetchClass({ id: classId }));
    return response;
  }
);
export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async ({ id }, { dispatch, rejectWithValue, getState }) => {
    const { accessToken = null } = getState().auth.user;
    const response = await client.delete(`/classes/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(fetchClasses());
    return response;
  }
);

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    classUpdated(state, action) {
      const { id, name, startDate, endDate, maxStudents } = action.payload;
      const foundIndex = state.classes.findIndex(
        (item) => item.id === Number.parseInt(id)
      );
      if (foundIndex === -1) return;

      state.classes[foundIndex] = {
        ...state.classes[foundIndex],
        name,
        startDate,
        endDate,
        maxStudents,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClasses.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload.content;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchClassesWithMyStatus.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchClassesWithMyStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload.content;
      })
      .addCase(fetchClassesWithMyStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(refetchClass.fulfilled, (state, action) => {
        const foundIndex = state.classes.findIndex(
          (item) => item.id === Number.parseInt(action.payload.content.id)
        );
        state.classes[foundIndex] = {
          ...state.classes[foundIndex],
          ...action.payload.content,
        };
      })
      .addCase(refetchClassWithStatus.fulfilled, (state, action) => {
        const foundIndex = state.classes.findIndex(
          (item) => item.id === Number.parseInt(action.payload.content.id)
        );
        state.classes[foundIndex] = {
          ...state.classes[foundIndex],
          ...action.payload.content,
        };
      })
      .addCase(deleteStudyTime.fulfilled, (state, action) => {})
      .addCase(addNewClass.fulfilled, (state, action) => {
        state.classes.unshift(action.payload.content);
      });
  },
});

export const { postAdded, classUpdated } = classesSlice.actions;

export default classesSlice.reducer;

export const selectAllClasses = (state) => state.classes.classes;

export const selectClassById = (state, classId) =>
  state.classes.classes.find((item) => item.id === classId);
