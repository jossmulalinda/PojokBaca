import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      return {
        email: sessionStorage.getItem('email'),
        id: sessionStorage.getItem('id'),
        token: sessionStorage.getItem('token'),
        username: sessionStorage.getItem('username'),
        role: sessionStorage.getItem('role'),
      };
    } catch {
      return { email: null, id: null, token: null, username: null, role: null };
    }
  }
  return { email: null, id: null, token: null, username: null, role: null };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setAuthData(state, action) {
      const { email, id, token, username, role } = action.payload;
      state.email = email;
      state.id = id;
      state.token = token;
      state.username = username;
      state.role = role;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('email', email || '');
        sessionStorage.setItem('id', id || '');
        sessionStorage.setItem('token', token || '');
        sessionStorage.setItem('username', username || '');
        sessionStorage.setItem('role', role || '');
      }
    },
    clearAuthData(state) {
      state.email = null;
      state.id = null;
      state.token = null;
      state.username = null;
      state.role = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role');
      }
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export const selectAuthData = (state) => state.auth;
export default authSlice.reducer;
