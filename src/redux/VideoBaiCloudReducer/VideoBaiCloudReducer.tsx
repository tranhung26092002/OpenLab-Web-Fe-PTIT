import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";


export interface VideoBaiNgoaiViResponse {
    id: number;
    videoPath: string;
    title: string;
    description: string;
    uploadTime: string;
}

export interface NgoaiViWithVideo {
    ngoaiViId: number;
    tenBaiNgoaiVi: string;
}

export interface NgoaiViWithVideoResponse {
    ngoaiViWithVideoDTO: NgoaiViWithVideo;
    videos: VideoBaiNgoaiViResponse[];
}

export interface BasResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface VideoNgoaiViListState {
    ngoaiViWithVideos: NgoaiViWithVideoResponse[] | null;
    loading: boolean;
    error: string | null;
    video: VideoBaiNgoaiViResponse[];
}

const initialListState: VideoNgoaiViListState = {
    ngoaiViWithVideos: null,
    loading: false,
    error: null,
    video: []
};

export const fetchAllNgoaiViWithVideo = createAsyncThunk(
    'videoBaiNgoaiVi/fetchAllNgoaiViWithVideo',
    async () => {
        const response = await http.get('/api/baingoaivi/allWithVideos');
        // console.log("response", response.data);
        return response.data.data;
    }
);

export const fetchVideoByBaiNgoaiViId = createAsyncThunk(
    'videoBaiNgoaiVi/fetchVideoByBaiNgoaiViId',
    async (baiNgoaiViId: number, thunkAPI) => {
        try {
            const response = await http.get(`/api/baingoaivi/video/byVideoBaiNgoaiVi/${baiNgoaiViId}`)
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const addVideoToNgoaiVi = createAsyncThunk(
    'videoBaiNgoaiVi/addVideoToNgoaiVi',
    async (data: { title: string; description: string; baiNgoaiViId: number; file: File }, thunkAPI) => {
        console.log("file video", data.file);
        console.log("title", data.title);
        console.log("description", data.description);
        console.log("baiNgoaiViId", data.baiNgoaiViId);

        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('baiNgoaiViId', String(data.baiNgoaiViId));

        const allData = formData.getAll('file');
        console.log("allData video", allData); // Điều này sẽ cho bạn biết liệu file video có được thêm vào `FormData` hay không.

        try {
            const response = await http.post('/api/baingoaivi/create', formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateVideoInNgoaiVi = createAsyncThunk(
    'videoBaiNgoaiVi/updateVideoInNgoaiVi',
    async (payload: { file?: File, title: string, description: string, videoId: number, baiNgoaiViId: number }) => {
        const formData = new FormData();
        if (payload.file) {
            formData.append('file', payload.file);
        }
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('videoId', payload.videoId.toString());
        if (payload.baiNgoaiViId == null) {
            throw new Error("baiNgoaiViId is undefined or null");
        }
        const baiNgoaiViIdValue = payload.baiNgoaiViId ?? '0';
        formData.append('baiNgoaiViId', baiNgoaiViIdValue.toString());


        const response = await http.put(`/api/baingoaivi/update/${payload.videoId}/${payload.baiNgoaiViId}`, formData);
        return response.data;


    }
);


export const deleteVideoFromNgoaiVi = createAsyncThunk(
    'videoBaiNgoaiVi/deleteVideoFromNgoaiVi',
    async (payload: { videoId: number, baiNgoaiViId: number }) => {
        const response = await http.delete(`/api/baingoaivi/delete/${payload.videoId}/${payload.baiNgoaiViId}`);
        return response.data;
    }
);

const videoNgoaiViSlice = createSlice({
    name: 'videoBaiNgoaiVi',
    initialState: initialListState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllNgoaiViWithVideo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchAllNgoaiViWithVideo.fulfilled, (state, action) => {
            state.ngoaiViWithVideos = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchAllNgoaiViWithVideo.rejected, (state, action) => {
            state.error = action.error.message || "Failed to fetch data";
            state.loading = false;
        });

        // fetchVideoByBaiGrammarId
        builder.addCase(fetchVideoByBaiNgoaiViId.fulfilled, (state, action) => {
            state.video = action.payload;
        })

        // Add video
        builder.addCase(addVideoToNgoaiVi.fulfilled, (state, action) => {
            const ngoaiVi = state.ngoaiViWithVideos?.find(baiNgoaiVi => baiNgoaiVi.ngoaiViWithVideoDTO.ngoaiViId === action.payload.ngoaiViId);
            if (ngoaiVi) {
                ngoaiVi.videos.push(action.payload);
            }
        })

        // update video
        builder.addCase(updateVideoInNgoaiVi.fulfilled, (state, action) => {
            if (state.ngoaiViWithVideos) {
                const index = state.ngoaiViWithVideos.findIndex(
                    (ngoaiVi) => ngoaiVi.ngoaiViWithVideoDTO.ngoaiViId === action.payload.ngoaiViId
                );
                if (index !== -1) {
                    const videoIndex = state.ngoaiViWithVideos[index].videos.findIndex(
                        (video) => video.id === action.payload.videoId
                    );
                    if (videoIndex !== -1) {
                        state.ngoaiViWithVideos[index].videos[videoIndex] = action.payload;
                    }
                }
            }
        })
        // delete video
        builder.addCase(deleteVideoFromNgoaiVi.fulfilled, (state, action) => {
            if (state.ngoaiViWithVideos) {
                const index = state.ngoaiViWithVideos?.findIndex((ngoaiVi) => ngoaiVi.ngoaiViWithVideoDTO.ngoaiViId === action.payload.ngoaiViId);
                if (index !== -1) {
                    state.ngoaiViWithVideos[index].videos = state.ngoaiViWithVideos[index].videos.filter(
                        (video) => video.id !== action.payload.videoId
                    );
                }
            }
        });


    }
})

export default videoNgoaiViSlice.reducer;