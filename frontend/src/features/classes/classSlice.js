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
    // const response = await client.get('/fakeApi/classes');
    // return response.data;
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
export const classUpdate = createAsyncThunk(
  'classes/updateClass',
  async (
    { id, name, startDate, endDate, maxStudents },
    { dispatch, rejectWithValue, getState }
  ) => {
    const { accessToken = null } = getState().auth.user;

    const response = await client.post(
      `/classes/${id}`,
      {
        id,
        name,
        startDate,
        endDate,
        maxStudents,
      },
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    dispatch(classUpdated({ id, name, startDate, endDate, maxStudents }));
    return response.data;
  }
);

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.classes.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    classUpdated(state, action) {
      const { id, name, startDate, endDate, maxStudents } = action.payload;
      const existingPost = state.classes.find((post) => post.id == id);
      if (existingPost) {
        existingPost.name = name;
        existingPost.startDate = startDate;
        existingPost.endDate = endDate;
        existingPost.maxStudents = maxStudents;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClasses.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched classes to the array
        state.classes = action.payload.content;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewClass.fulfilled, (state, action) => {
        console.log(action);
        state.classes.push(action.payload);
      })
      .addCase(classUpdate.fulfilled, (state, action) => {
        // state.classes.push(action.payload);
        // const { id, name, content, startDate, endDate, maxStudents } =
        //   action.payload.content;
        // const existingPost = state.classes.find((post) => post.id == id);
        // if (existingPost) {
        //   existingPost.name = name;
        //   existingPost.content = content;
        //   existingPost.startDate = startDate;
        //   existingPost.endDate = endDate;
        //   existingPost.maxStudents = maxStudents;
        // }
      });
  },
});

export const { postAdded, classUpdated, reactionAdded } = classesSlice.actions;

export default classesSlice.reducer;

export const selectAllClasses = (state) => state.classes.classes;

export const selectClassById = (state, classId) =>
  state.classes.classes.find((item) => item.id === classId);
