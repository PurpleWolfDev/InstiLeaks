import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imagePreview : false,
};
const imageSlice = createSlice({
  name: "imageSlice",
  initialState,
  reducers: {
    toggleImage: (state, action) => {
        state.imagePreview = action.payload.imagePreview;
    },
  }
});

export const { toggleImage } = imageSlice.actions;
export default imageSlice.reducer;
