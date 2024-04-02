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


export interface CommentCamBien {
    cmtCamBienContent: string;
    time: string;
    cmtCamBienId: number;
    user: { email: string };
}

export interface CommentCamBienPost {
    baiCamBienId: number;
    cmtCamBienContent: string;
    userId: number;
}



export interface CommentResponse<T> {
    status: number;
    message: string;
    data: T;
}

export const fetchCommentsCamBien = createAsyncThunk<CommentResponse<CommentCamBien[]>, number>(
    'comments/fetchCommentsCamBien',
    async (baiCamBienId) => {
        const response = await http.get<CommentResponse<CommentCamBien[]>>(`/api/comments/cambien/${baiCamBienId}`);
        return response.data;
    }
);

export const addCommentCamBien = createAsyncThunk<CommentResponse<CommentCamBien>, CommentCamBienPost>(
    'comments/addCommentCamBien',
    async (commentCamBien: CommentCamBienPost) => {
        const response = await http.post<CommentResponse<CommentCamBien>>('/api/comments/cambien', commentCamBien);
        return response.data;
    }
);

const CommentBaiKhoiCamBien = createSlice({
    name: 'comments',
    initialState: {
        comments: [] as CommentCamBien[]

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsCamBien.fulfilled, (state, action: PayloadAction<CommentResponse<CommentCamBien[]>>) => {
                state.comments = action.payload.data;
            })
            .addCase(addCommentCamBien.fulfilled, (state, action: PayloadAction<CommentResponse<CommentCamBien>>) => {
                state.comments.push(action.payload.data);
            });
    },
});

export default CommentBaiKhoiCamBien.reducer