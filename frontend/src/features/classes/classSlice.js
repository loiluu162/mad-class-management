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

export const addNewPost = createAsyncThunk(
  'classes/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/classes', initialPost);
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
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.classes.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
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
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.classes.push(action.payload);
      });
  },
});

export const { postAdded, postUpdated, reactionAdded } = classesSlice.actions;

export default classesSlice.reducer;

export const selectAllClasses = (state) => state.classes.classes;

export const selectClassById = (state, classId) =>
  state.classes.classes.find((item) => item.id === classId);
