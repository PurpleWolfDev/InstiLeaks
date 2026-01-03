import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./slices/authSlice.js";
import authReducer from './slices/authSlice.js';
import searchReducer from './slices/searchSlice.js';
import loadingReducer from "./slices/loaderSlice.js"
import scrollReducer from "./slices/scrollSlice.js";
import reportReducer from "./slices/reportSlice.js";
import commentReducer from './slices/commentSlice.js';
import imageReducer from './slices/imageSlice.js';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    image: imageReducer,
    search: searchReducer,
    loading: loadingReducer,
    scroll:scrollReducer,
    report: reportReducer,
    comment: commentReducer
  },
});
