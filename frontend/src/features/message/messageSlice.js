import { createSlice } from '@reduxjs/toolkit';

const initialState = { message: null };

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      return { message: action.payload };
    },
    clearMessage: () => {
      return { message: null };
    },
  },
});

const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = actions;

export const selectMessage = (state) => state.message.message;

export default reducer;
