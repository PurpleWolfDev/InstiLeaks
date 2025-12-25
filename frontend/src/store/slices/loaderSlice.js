import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading : false,
};
const loadingSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    toggleLoading: (state, action) => {
        state.isLoading = action.payload.isLoading;
    },
  }
});

export const { toggleLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
