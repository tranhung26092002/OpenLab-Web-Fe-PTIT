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


export interface CommentNgoaiVi {
    cmtNgoaiViContent: string;
    time: string;
    cmtNgoaiViId: number;
    user: { email: string };
}

export interface CommentNgoaiViPost {
    baiNgoaiVid: number;
    cmtNgoaiViContent: string;
    userId: number;
}



export interface CommentResponse<T> {
    status: number;
    message: string;
    data: T;
}

export const fetchCommentsNgoaiVi = createAsyncThunk<CommentResponse<CommentNgoaiVi[]>, number>(
    'comments/fetchCommentsNgoaiVi',
    async (baiNgoaiViId) => {
        const response = await http.get<CommentResponse<CommentNgoaiVi[]>>(`/api/comments/ngoaivi/${baiNgoaiViId}`);
        return response.data;
    }
);

export const addCommentNgoaiVi = createAsyncThunk<CommentResponse<CommentNgoaiVi>, CommentNgoaiViPost>(
    'comments/addCommentNgoaiVi',
    async (commentNgoaiVi: CommentNgoaiViPost) => {
        const response = await http.post<CommentResponse<CommentNgoaiVi>>('/api/comments/ngoaivi', commentNgoaiVi);
        return response.data;
    }
);


const CommentBaiKhoiNgoaiVi = createSlice({
    name: 'comments',
    initialState: {
        comments: [] as CommentNgoaiVi[]

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsNgoaiVi.fulfilled, (state, action: PayloadAction<CommentResponse<CommentNgoaiVi[]>>) => {
                state.comments = action.payload.data;
            })
            .addCase(addCommentNgoaiVi.fulfilled, (state, action: PayloadAction<CommentResponse<CommentNgoaiVi>>) => {
                state.comments.push(action.payload.data);
            });
    },
});

export default CommentBaiKhoiNgoaiVi.reducer