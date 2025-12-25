import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  display : false,
  postId:""
};
const commentSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    toggleComment: (state, action) => {
        state.display = action.payload.display;
        state.postId = action.payload.postId;
    },
  }
});

export const { toggleComment } = commentSlice.actions;
export default commentSlice.reducer;
