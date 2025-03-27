import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../http";

const interviewSlice = createSlice({
  name: "movie",
  initialState: {
    data: [],
  },
  reducers: {
    fetchInterviewSuccess(state, action) {
      state.data = action.payload;
    },
  },
});

export const { fetchInterviewSuccess } = interviewSlice.actions;
export const interviewReducer = interviewSlice.reducer;

export const fetchInterview = createAsyncThunk(
  "interview/fetchInterview",
  async (_, { dispatch }) => {
    try {
      const response = await http({
        method: "GET",
        url: "/interview/active",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const interviewData = response.data;

      dispatch(fetchInterviewSuccess(interviewData));
    } catch (error) {
      console.log(error, "<<<");
    }
  }
);
