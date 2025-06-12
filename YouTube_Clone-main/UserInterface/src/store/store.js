import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';

const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('authState');
    if (serializedState === null) return undefined;
    return { auth: JSON.parse(serializedState) };
  } catch (e) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    sessionStorage.setItem('authState', JSON.stringify(state.auth));
  } catch (e) {}
};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
