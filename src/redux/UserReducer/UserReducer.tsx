import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ACCESS_TOKEN, USER_LOGIN, history, http, settings } from "../../util/config";


export interface LoginRequestPayload {
    email: string;
    password: string;
}

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null | undefined;
    userId: number | null;
    email: string | null;
    role: string | null;
    users: User[];
}

export interface LoginResponse {
    token: string;
    userId: number | null;
    role: string | null;
    email: string | null;
    message: string;
    status: number;
}


export interface BaseResponse {
    status: number;
    message: string;
    data: any;
}

export interface RejectedValue {
    message: string;
}

export interface ApiResponse {
    status: number;
    message: string;
    data: User;
}

export interface User {
    id: number;
    email: string;
    password: string;
    vaiTro: number;
}

const userLoginData = settings.getStorageJson(USER_LOGIN);

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: localStorage.getItem('token') ? true : false,
    loading: false,
    error: "",
    userId: userLoginData && userLoginData.userId ? Number(userLoginData.userId) : null,
    email: userLoginData && userLoginData.email,
    role: userLoginData && userLoginData.role,
    users: []
};

export const loginUser = createAsyncThunk<LoginResponse, LoginRequestPayload, { rejectValue: RejectedValue }>(
    'auth/loginUser',
    async (data: LoginRequestPayload, thunkAPI) => {
        try {
            const response: AxiosResponse<BaseResponse> = await http.post('/auth/login', data);
            console.log("Response from server:", response.data);
            if (response.data.status === 200) {
                return {
                    token: response.data.data.token,
                    userId: response.data.data.userId,
                    role: response.data.data.role,
                    email: response.data.data.email,
                    message: response.data.message,
                    status: response.data.status                };
            } else {
                return thunkAPI.rejectWithValue({ message: response.data.message });
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

export const addUser = createAsyncThunk<ApiResponse, User, { rejectValue: string }>(
    'auth/addUser',
    async (userData, thunkAPI) => {
        try {
            const response = await http.post<ApiResponse>('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const editUser = createAsyncThunk<ApiResponse, { userId: number, userData: User }, { rejectValue: string }>(
    'auth/editUser',
    async ({ userId, userData }, thunkAPI) => {
        try {
            const params = new URLSearchParams();
            params.append('email', userData.email);
            params.append('password', userData.password);
            params.append('vaiTro', userData.vaiTro.toString());

            const response = await http.put<ApiResponse>(`/auth/${userId}`, params);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getAllUsers = createAsyncThunk<ApiResponse, void, { rejectValue: string }>(
    'auth/getAllUsers',
    async (_, thunkAPI) => {
        try {
            const response = await http.get<ApiResponse>('/auth');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk<ApiResponse, number, { rejectValue: ApiResponse }>(
    'auth/deleteUser',
    async (userId, thunkAPI) => {
        try {
            const response = await http.delete(`/auth/${userId}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const userReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Thêm action logout
        logout: (state: AuthState) => {
            // Xóa thông tin người dùng khỏi state
            state.token = null;
            state.isAuthenticated = false;
            state.userId = null;
            state.email = null;
            state.role = null;
            // Xóa token và thông tin người dùng khỏi local storage
            localStorage.removeItem('token');
            settings.clearStorage(ACCESS_TOKEN);
            settings.clearStorage(USER_LOGIN);
            window.location.reload();
            // Thêm các bước khác nếu cần
            history.push("/login");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.loading = false;
            state.isAuthenticated = true;

            // Lưu token vào state và ACCESS_TOKEN
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            settings.setStorage(ACCESS_TOKEN, action.payload.token);
            // Lưu toàn bộ thông tin API trả về vào userLogin
            settings.setStorageJson(USER_LOGIN, {
                token: action.payload.token,
                userId: action.payload.userId,
                role: action.payload.role,
                email: action.payload.email,
            });
            history.push("/home");

        });

        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.error = action.payload.message;
            } else if (action.error) {
                state.error = action.error.message;
            }
        });

        builder.addCase(addUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
            state.users.push(action.payload.data);
        });
        builder.addCase(editUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
            const index = state.users.findIndex(user => user.id === action.payload.data.id);
            if (index !== -1) {
                state.users[index] = action.payload.data;
            }
            state.loading = false;
        });

        builder.addCase(getAllUsers.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
            if (Array.isArray(action.payload.data)) {
                state.users = action.payload.data;
            }
        })
        builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
            console.log("action", action.payload);
            const index = state.users.findIndex(user => user.id === action.payload.data.id);
            if (index !== -1) {
                state.users.splice(index, 1);
            }
            // state.loading = false;
        });
    },
});

export const { logout } = userReducer.actions;
export default userReducer.reducer;
