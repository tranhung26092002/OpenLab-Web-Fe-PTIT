import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";


export interface VideoBaiGrammarResponse {
    id: number;
    videoPath: string;
    title: string;
    description: string;
    uploadTime: string;
}

export interface GrammarWithVideo {
    baiGrammarId: number;
    tenBaiGrammar: string;
}

export interface GrammarWithVideoResponse {
    grammarWithVideoDTO: GrammarWithVideo;
    videos: VideoBaiGrammarResponse[];
}

export interface BasResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface VideoGrammarListState {
    grammarWithVideos: GrammarWithVideoResponse[] | null;
    loading: boolean;
    error: string | null;
    video: VideoBaiGrammarResponse[];
}

const initialListState: VideoGrammarListState = {
    grammarWithVideos: null,
    loading: false,
    error: null,
    video: []
};

export const fetchAllGrammarWithVideo = createAsyncThunk(
    'videoBaiGrammar/fetchAllGrammarWithVideo',
    async () => {
        const response = await http.get('/api/baigrammar/allWithVideos');
        // console.log("response", response.data);
        return response.data.data;
    }
);

export const fetchVideoByBaiGrammarId = createAsyncThunk(
    'videoBaiGrammar/fetchVideoByBaiGrammarId',
    async (baiGrammarId: number, thunkAPI) => {
        try {
            const response = await http.get(`/api/baigrammar/video/byVideoBaiGrammar/${baiGrammarId}`)
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const addVideoToGrammar = createAsyncThunk(
    'videoBaiGrammar/addVideoToGrammar',
    async (data: { title: string; description: string; baiGrammarId: number; file: File }, thunkAPI) => {
        console.log("file video", data.file);
        console.log("title", data.title);
        console.log("description", data.description);
        console.log("baiGrammarId", data.baiGrammarId);

        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('baiGrammarId', String(data.baiGrammarId));

        const allData = formData.getAll('file');
        console.log("allData video", allData); // Điều này sẽ cho bạn biết liệu file video có được thêm vào `FormData` hay không.

        try {
            const response = await http.post('/api/baigrammar/create', formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateVideoInGrammar = createAsyncThunk(
    'videoBaiGrammar/updateVideoInGrammar',
    async (payload: { file?: File, title: string, description: string, videoId: number, baiGrammarId: number }) => {
        const formData = new FormData();
        if (payload.file) {
            formData.append('file', payload.file);
        }
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('videoId', payload.videoId.toString());
        if (payload.baiGrammarId == null) {
            throw new Error("baiGrammarId is undefined or null");
        }
        const baiGrammarIdValue = payload.baiGrammarId ?? '0';
        formData.append('baiGrammarId', baiGrammarIdValue.toString());


        const response = await http.put(`/api/baigrammar/update/${payload.videoId}/${payload.baiGrammarId}`, formData);
        return response.data;


    }
);


export const deleteVideoFromGrammar = createAsyncThunk(
    'videoBaiGrammar/deleteVideoFromGrammar',
    async (payload: { videoId: number, baiGrammarId: number }) => {
        const response = await http.delete(`/api/baigrammar/delete/${payload.videoId}/${payload.baiGrammarId}`);
        return response.data;
    }
);

const videoGrammarSlice = createSlice({
    name: 'videoBaiGrammar',
    initialState: initialListState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllGrammarWithVideo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchAllGrammarWithVideo.fulfilled, (state, action) => {
            state.grammarWithVideos = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchAllGrammarWithVideo.rejected, (state, action) => {
            state.error = action.error.message || "Failed to fetch data";
            state.loading = false;
        });

        // fetchVideoByBaiGrammarId
        builder.addCase(fetchVideoByBaiGrammarId.fulfilled, (state, action) => {
            state.video = action.payload;
        })

        // Add video
        builder.addCase(addVideoToGrammar.fulfilled, (state, action) => {
            const grammar = state.grammarWithVideos?.find(baiGrammar => baiGrammar.grammarWithVideoDTO.baiGrammarId === action.payload.baiGrammarId);
            if (grammar) {
                grammar.videos.push(action.payload);
            }
        })

        // update video
        builder.addCase(updateVideoInGrammar.fulfilled, (state, action) => {
            if (state.grammarWithVideos) {
                const index = state.grammarWithVideos.findIndex(
                    (grammar) => grammar.grammarWithVideoDTO.baiGrammarId === action.payload.baiGrammarId
                );
                if (index !== -1) {
                    const videoIndex = state.grammarWithVideos[index].videos.findIndex(
                        (video) => video.id === action.payload.videoId
                    );
                    if (videoIndex !== -1) {
                        state.grammarWithVideos[index].videos[videoIndex] = action.payload;
                    }
                }
            }
        })
        // delete video
        builder.addCase(deleteVideoFromGrammar.fulfilled, (state, action) => {
            if (state.grammarWithVideos) {
                const index = state.grammarWithVideos?.findIndex((grammar) => grammar.grammarWithVideoDTO.baiGrammarId === action.payload.baiGrammarId);
                if (index !== -1) {
                    state.grammarWithVideos[index].videos = state.grammarWithVideos[index].videos.filter(
                        (video) => video.id !== action.payload.videoId
                    );
                }
            }
        });


    }
})

export default videoGrammarSlice.reducer;