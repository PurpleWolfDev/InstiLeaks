import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isReport : false,
  reportId : ""
};
const reportSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    toggleReport: (state, action) => {
        state.isReport = action.payload.isReport;
    },
    updateReportId: (state, action) => {
        state.reportId = action.payload.reportId;
    }
  }
});

export const { toggleReport,updateReportId } = reportSlice.actions;
export default reportSlice.reducer;
