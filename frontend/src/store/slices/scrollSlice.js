import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  generalEndState:10,
  memeEndState:10,
  pollEndState:10,

};
const scrollSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    generalSrollAdd: (state) => {
        state.generalEndState = state.generalEndState+10;
    },
    memeScrollAdd: (state, action) => {
        state.memeEndState = state.memeEndState+10;
    },
    pollScrollAdd: (state, action) => {
        state.pollEndState = state.pollEndState+10;
    },
    generalSrollMinus: (state) => {
        state.generalEndState = (state.generalEndState>10)?state.generalEndState-10:10;
    },
    memeScrollMinus: (state, action) => {
        state.memeEndState = (state.memeEndState>10)?state.memeEndState-10:10;
    },
    pollScrollMinus: (state, action) => {
        state.pollEndState = (state.pollEndState>10)?state.pollEndState-10:10;
    },
  }
});

export const { generalScrollAdd, memeScrollAdd, pollScrollAdd, generalScrollMinus, memeScrollMinus, pollScrollMinus } = scrollSlice.actions;
export default scrollSlice.reducer;
