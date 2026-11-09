import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

let savedUser = store.getState().auth.user;
store.subscribe(() => {
  const { user } = store.getState().auth;
  if (user === savedUser) return;
  savedUser = user;
  try {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch {
  }
});

export default store;