import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";


export interface VideoBaiCamBienResponse {
    id: number;
    videoPath: string;
    title: string;
    description: string;
    uploadTime: string;
}

export interface CamBienWithVideo {
    camBienId: number;
    tenBaiCamBien: string;
}

export interface CamBienWithVideoResponse {
    camBienWithVideoDTO: CamBienWithVideo;
    videos: VideoBaiCamBienResponse[];
}

export interface BasResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface VideoCamBienListState {
    camBienWithVideos: CamBienWithVideoResponse[] | null;
    loading: boolean;
    error: string | null;
    video: VideoBaiCamBienResponse[];
}

const initialListState: VideoCamBienListState = {
    camBienWithVideos: null,
    loading: false,
    error: null,
    video: []
};

export const fetchAllCamBienWithVideo = createAsyncThunk(
    'videoBaiCamBien/fetchAllCamBienWithVideo',
    async () => {
        const response = await http.get('/api/baicambien/allWithVideos');
        // console.log("response", response.data);
        return response.data.data;
    }
);

export const fetchVideoByBaiCamBienId = createAsyncThunk(
    'videoBaiCamBien/fetchVideoByBaiCamBienId',
    async (baiCamBienId: number, thunkAPI) => {
        try {
            const response = await http.get(`/api/baicambien/video/byVideoBaiCamBien/${baiCamBienId}`)
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const addVideoToCamBien = createAsyncThunk(
    'videoBaiCamBien/addVideoToCamBien',
    async (data: { title: string; description: string; baiCamBienId: number; file: File }, thunkAPI) => {
        console.log("file video", data.file);
        console.log("title", data.title);
        console.log("description", data.description);
        console.log("baiCamBienId", data.baiCamBienId);

        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('baiCamBienId', String(data.baiCamBienId));

        const allData = formData.getAll('file');
        console.log("allData video", allData); // Điều này sẽ cho bạn biết liệu file video có được thêm vào `FormData` hay không.

        try {
            const response = await http.post('/api/baicambien/create', formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateVideoInCamBien = createAsyncThunk(
    'videoBaiCamBien/updateVideoInCamBien',
    async (payload: { file?: File, title: string, description: string, videoId: number, baiCamBienId: number }) => {
        const formData = new FormData();
        if (payload.file) {
            formData.append('file', payload.file);
        }
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('videoId', payload.videoId.toString());
        if (payload.baiCamBienId == null) {
            throw new Error("baiCamBienId is undefined or null");
        }
        const baiCamBienIdValue = payload.baiCamBienId ?? '0';
        formData.append('baiCamBienId', baiCamBienIdValue.toString());


        const response = await http.put(`/api/baicambien/update/${payload.videoId}/${payload.baiCamBienId}`, formData);
        return response.data;


    }
);


export const deleteVideoFromCamBien = createAsyncThunk(
    'videoBaiCamBien/deleteVideoFromCamBien',
    async (payload: { videoId: number, baiCamBienId: number }) => {
        const response = await http.delete(`/api/baicambien/delete/${payload.videoId}/${payload.baiCamBienId}`);
        return response.data;
    }
);

const videoCamBienSlice = createSlice({
    name: 'videoBaiCamBien',
    initialState: initialListState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllCamBienWithVideo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchAllCamBienWithVideo.fulfilled, (state, action) => {
            state.camBienWithVideos = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchAllCamBienWithVideo.rejected, (state, action) => {
            state.error = action.error.message || "Failed to fetch data";
            state.loading = false;
        });

        // fetchVideoByBaiGrammarId
        builder.addCase(fetchVideoByBaiCamBienId.fulfilled, (state, action) => {
            state.video = action.payload;
        })

        // Add video
        builder.addCase(addVideoToCamBien.fulfilled, (state, action) => {
            const camBien = state.camBienWithVideos?.find(baiCamBien => baiCamBien.camBienWithVideoDTO.camBienId === action.payload.camBienId);
            if (camBien) {
                camBien.videos.push(action.payload);
            }
        })

        // update video
        builder.addCase(updateVideoInCamBien.fulfilled, (state, action) => {
            if (state.camBienWithVideos) {
                const index = state.camBienWithVideos.findIndex(
                    (camBien) => camBien.camBienWithVideoDTO.camBienId === action.payload.camBienId
                );
                if (index !== -1) {
                    const videoIndex = state.camBienWithVideos[index].videos.findIndex(
                        (video) => video.id === action.payload.videoId
                    );
                    if (videoIndex !== -1) {
                        state.camBienWithVideos[index].videos[videoIndex] = action.payload;
                    }
                }
            }
        })
        // delete video
        builder.addCase(deleteVideoFromCamBien.fulfilled, (state, action) => {
            if (state.camBienWithVideos) {
                const index = state.camBienWithVideos?.findIndex((camBien) => camBien.camBienWithVideoDTO.camBienId === action.payload.camBienId);
                if (index !== -1) {
                    state.camBienWithVideos[index].videos = state.camBienWithVideos[index].videos.filter(
                        (video) => video.id !== action.payload.videoId
                    );
                }
            }
        });


    }
})

export default videoCamBienSlice.reducer;