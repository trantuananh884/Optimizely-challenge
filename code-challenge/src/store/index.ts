import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DebouncedQueryState {
  debouncedQuery: string;
}

interface ActiveRepoState {
  activeRepo: number;
}

const deboucedQueryInitialState: DebouncedQueryState = {
  debouncedQuery: "",
};
const activeRepoInitialState: ActiveRepoState = {
  activeRepo: -1,
};
const debouncedQuerySlice = createSlice({
  name: "debouncedQuery",
  initialState: deboucedQueryInitialState,
  reducers: {
    setdebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
  },
});
const activeRepoSlice = createSlice({
  name: "activeRepo",
  initialState: activeRepoInitialState,
  reducers: {
    setActiveRepo: (state, action: PayloadAction<number>) => {
      state.activeRepo = action.payload;
    },
  },
});
const store = configureStore({
  reducer: {
    debouncedQuery: debouncedQuerySlice.reducer,
    activeRepo: activeRepoSlice.reducer,
  },
});
export const debouncedQueryActions = debouncedQuerySlice.actions;
export const activeRepoActions = activeRepoSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
