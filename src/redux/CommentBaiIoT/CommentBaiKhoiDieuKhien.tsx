import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { http } from '../../util/config';


export interface User {
    diaChi?: string;
    email: string;
    hoTen?: string;
    id: number;
    password: string;
    soDienThoai?: string;
    vaiTro: number;
}


export interface CommentDieuKhien {
    cmtDieuKhienContent: string;
    time: string;
    cmtDieuKhienId: number;
    user: { email: string };
}

export interface CommentDieuKhienPost {
    baiDieuKhienId: number;
    cmtDieuKhienContent: string;
    userId: number;
}



export interface CommentResponse<T> {
    status: number;
    message: string;
    data: T;
}

export const fetchCommentsDieuKhien = createAsyncThunk<CommentResponse<CommentDieuKhien[]>, number>(
    'comments/fetchCommentsDieuKhien',
    async (baiDieuKhienId) => {
        const response = await http.get<CommentResponse<CommentDieuKhien[]>>(`/api/comments/dieukhien/${baiDieuKhienId}`);
        return response.data;
    }
);

export const addCommentDieuKhien = createAsyncThunk<CommentResponse<CommentDieuKhien>, CommentDieuKhienPost>(
    'comments/addCommentDieuKhien',
    async (commentDieuKhien: CommentDieuKhienPost) => {
        const response = await http.post<CommentResponse<CommentDieuKhien>>('/api/comments/dieukhien', commentDieuKhien);
        return response.data;
    }
);

const CommentBaiKhoiDieuKhien = createSlice({
    name: 'comments',
    initialState: {
        comments: [] as CommentDieuKhien[]

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsDieuKhien.fulfilled, (state, action: PayloadAction<CommentResponse<CommentDieuKhien[]>>) => {
                state.comments = action.payload.data;
            })
            .addCase(addCommentDieuKhien.fulfilled, (state, action: PayloadAction<CommentResponse<CommentDieuKhien>>) => {
                state.comments.push(action.payload.data);
            });
    },
});

export default CommentBaiKhoiDieuKhien.reducer