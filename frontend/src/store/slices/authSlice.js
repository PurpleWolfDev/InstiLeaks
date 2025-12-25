import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged:false,
  pfpLink:"none",
  gender:"none",
  name:"",
  uId:0,
  idName:"none",
    bio:"",
    rollNo:"",
  notificationSettings : {}
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogged = true;
      state.pfpLink = action.payload.pfpLink;
      state.name = action.payload.name;
      state.uId = action.payload.uId;
      state.notificationSettings = action.payload.notificationSettings;
      state.idName = action.payload.idName;
      state.bio = action.payload.bio;
      state.rollNo = action.payload.rollNo;
    },
    logout: (state) => {
      state = {
        isLogged:false,
        pfpLink:"none",
        gender:"none",
        idName:"none",
        bio:"",
        rollNo:"",
        name:"",
        uId:0,
        notificationSettings : {}
      }
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
