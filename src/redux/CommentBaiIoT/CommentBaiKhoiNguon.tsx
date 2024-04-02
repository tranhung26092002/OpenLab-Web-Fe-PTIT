import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import React from 'react'
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

export interface CommentGrammar {
    cmtgrammarcontent: string;
    userId: number;
    baiGrammarId: number;
    user: { email: string };
}

export interface CommentGrammarPost {
    baiGrammarId: number;
    cmtGrammarContent: string;
    userId: number;
}



export interface CommentResponse<T> {
    status: number;
    message: string;
    data: T;
}

export const fetchComments = createAsyncThunk<CommentResponse<CommentGrammar[]>, number>(
    'comments/fetchComments',
    async (baiGrammarId) => {
        const response = await http.get<CommentResponse<CommentGrammar[]>>(`/api/comments/grammar/${baiGrammarId}`);
        return response.data;
    }
);

export const addComment = createAsyncThunk<CommentResponse<CommentGrammar>, CommentGrammarPost>(
    'comments/addComment',
    async (commentGrammar: CommentGrammarPost) => {
        const response = await http.post<CommentResponse<CommentGrammar>>('/api/comments', commentGrammar);
        return response.data;
    }
);

const CommentBaiKhoiNguon = createSlice({
    name: 'comments',
    initialState: {
        comments: [] as CommentGrammar[]

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.fulfilled, (state, action: PayloadAction<CommentResponse<CommentGrammar[]>>) => {
                state.comments = action.payload.data;
            })
            .addCase(addComment.fulfilled, (state, action: PayloadAction<CommentResponse<CommentGrammar>>) => {
                state.comments.push(action.payload.data);
            });
    },
});

export default CommentBaiKhoiNguon.reducer