import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchParam:"",
  filteredResults:[],
  baseResult:[],
};
const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    searchFilter: (state, action) => {
      console.log(action.payload);
      state.searchParam = action.payload.query.toLowerCase();
      const query = action.payload.query.toLowerCase();
      if(action.payload?.filterTab) {
        state.filteredResults = state.baseResult.filter((e) => (e.title.toLowerCase().includes(query) && e.postType.toLowerCase() == action.payload?.filterTab));
      }
      else {
        state.filteredResults = state.baseResult.filter((e) => (e.title.toLowerCase().includes(query)));
      }
    },
    setBaseState: (state, action) => {
      let arr1 = state.baseResult;
      let arr2 = action.payload.baseFeed;
      let arr3 = [...arr1, ...arr2];
      let set = new Set(arr3);
      
      state.baseResult = action.payload.baseFeed;

      state.filteredResults = state.baseResult.filter((e) => (e.postType.toLowerCase() == "general"));
    },
    setBaseState2:(state, action) => {
      let arr1 = state.baseResult;
      let arr2 = action.payload.baseFeed;
      let arr3 = [...arr1, ...arr2];
      let set = new Set(arr3);
      
      state.baseResult = action.payload.baseFeed;
      state.filteredResults = state.baseResult.filter((e) => (e.postType.toLowerCase() == "meme"));
    },
    setBaseState3:(state, action) => {
      let arr1 = state.baseResult;
      let arr2 = action.payload.baseFeed;
      let arr3 = [...arr1, ...arr2];
      let set = new Set(arr3);
      
      state.baseResult = action.payload.baseFeed;
      state.filteredResults = state.baseResult.filter((e) => (e.postType.toLowerCase() == "polls"));
    },
    filterTabs: (state, action) => {
      state.filteredResults = state.baseResult.filter((e) => (e.postType.toLowerCase() == action.payload.query));
    }
  }
});

export const { searchFilter, setBaseState, filterTabs, setBaseState2, setBaseState3 } = searchSlice.actions;
export default searchSlice.reducer;
