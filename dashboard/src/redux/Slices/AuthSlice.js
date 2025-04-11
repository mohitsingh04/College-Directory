import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { API } from '../../services/API';

// Async thunk to handle user registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await API.post('/register', userData);
            if (response.data.message) {
                toast.success(response.data.message);
                return response.data;
            } else {
                toast.error(response.data.error);
                return rejectWithValue(response.data.error);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to handle user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await API.post('/login', userData, { withCredentials: true });

            if (response.status === 200) {
                toast.success(response.data.message);
                return response.data; // Returning user data to update Redux state
            } else {
                toast.error(response.data.error);
                return rejectWithValue(response.data.error);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
