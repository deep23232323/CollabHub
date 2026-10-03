// store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null, // logged-in user's info
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "userInfo",

  initialState,

  reducers: {
    // Set complete user data after login
    setUserInfo: (state, action) => {
      state.data = action.payload;
    },

    // Update any user fields
    updateUserInfo: (state, action) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },

    // Update onboarding first-page data
    updateOnboardingProfile: (state, action) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },

    // Update individual fields
    setFullName: (state, action) => {
      if (state.data) {
        state.data.fullName = action.payload;
      }
    },

    setUsername: (state, action) => {
      if (state.data) {
        state.data.username = action.payload;
      }
    },

    setCity: (state, action) => {
      if (state.data) {
        state.data.city = action.payload;
      }
    },

    setLanguage: (state, action) => {
      if (state.data) {
        state.data.language = action.payload;
      }
    },

    setPhoneNumber: (state, action) => {
      if (state.data) {
        state.data.phoneNumber = action.payload;
      }
    },

    setMainNiche: (state, action) => {
      if (state.data) {
        state.data.mainNiche = action.payload;
      }
    },

    setCreatorBio: (state, action) => {
      if (state.data) {
        state.data.creatorBio = action.payload;
      }
    },

    clearUserInfo: (state) => {
      state.data = null;
    },
    updateSocialLinks: (state, action) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateSocialLinks,
  setUserInfo,
  updateUserInfo,
  updateOnboardingProfile,
  setFullName,
  setUsername,
  setCity,
  setLanguage,
  setPhoneNumber,
  setMainNiche,
  setCreatorBio,
  clearUserInfo,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
