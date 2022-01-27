import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    lang: localStorage.getItem('lang') || (localStorage.setItem('lang', 'en') && 'en'),
    weight: localStorage.getItem('weight ') || (localStorage.setItem('weight ', 'kg') && 'kg'),
    distance: localStorage.getItem('distance') || (localStorage.setItem('distance', 'meters') && 'meters'),
  },
  reducers: {
    changeLang: (state, action) => {
      state.lang = action.payload;
      localStorage.setItem('lang', action.payload);
    },
    changeWeight: (state, action) => {
      state.weight = action.payload;
      localStorage.setItem('weight', action.payload);
    },
    changeDistance: (state, action) => {
      state.distance = action.payload;
      localStorage.setItem('distance', action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeLang, changeWeight, changeDistance } = settingsSlice.actions;

export default settingsSlice.reducer;
