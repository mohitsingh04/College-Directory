import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/Slices/AuthSlice";

export const store = configureStore({
    auth: authReducer
});

export default store;