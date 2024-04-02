import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";


export interface VideoBaiDieuKhienResponse {
    id: number;
    videoPath: string;
    title: string;
    description: string;
    uploadTime: string;
}

export interface DieuKhienWithVideo {
    dieuKhienId: number;
    tenBaiDieuKhien: string;
}

export interface DieuKhienWithVideoResponse {
    dieuKhienWithVideoDTO: DieuKhienWithVideo;
    videos: VideoBaiDieuKhienResponse[];
}

export interface BasResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface VideoDieuKhienListState {
    dieuKhienWithVideos: DieuKhienWithVideoResponse[] | null;
    loading: boolean;
    error: string | null;
    video: VideoBaiDieuKhienResponse[];
}

const initialListState: VideoDieuKhienListState = {
    dieuKhienWithVideos: null,
    loading: false,
    error: null,
    video: []
};

export const fetchAllDieuKhienWithVideo = createAsyncThunk(
    'videoBaiDieuKhien/fetchAllDieuKhienWithVideo',
    async () => {
        const response = await http.get('/api/baidieukhien/allWithVideos');
        // console.log("response", response.data);
        return response.data.data;
    }
);

export const fetchVideoByBaiDieuKhienId = createAsyncThunk(
    'videoBaiDieuKhien/fetchVideoByBaiDieuKhienId',
    async (baiDieuKhienId: number, thunkAPI) => {
        try {
            const response = await http.get(`/api/baidieukhien/video/byVideoBaiDieuKhien/${baiDieuKhienId}`)
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const addVideoToDieuKhien = createAsyncThunk(
    'videoBaiDieuKhien/addVideoToDieuKhien',
    async (data: { title: string; description: string; baiDieuKhienId: number; file: File }, thunkAPI) => {
        console.log("file video", data.file);
        console.log("title", data.title);
        console.log("description", data.description);
        console.log("baiDieuKhienId", data.baiDieuKhienId);

        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('baiDieuKhienId', String(data.baiDieuKhienId));

        const allData = formData.getAll('file');
        console.log("allData video", allData); // Điều này sẽ cho bạn biết liệu file video có được thêm vào `FormData` hay không.

        try {
            const response = await http.post('/api/baidieukhien/create', formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateVideoInDieuKhien = createAsyncThunk(
    'videoBaiDieuKhien/updateVideoInDieuKhien',
    async (payload: { file?: File, title: string, description: string, videoId: number, baiDieuKhienId: number }) => {
        const formData = new FormData();
        if (payload.file) {
            formData.append('file', payload.file);
        }
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('videoId', payload.videoId.toString());
        if (payload.baiDieuKhienId == null) {
            throw new Error("baiDieuKhienId is undefined or null");
        }
        const baiDieuKhienIdValue = payload.baiDieuKhienId ?? '0';
        formData.append('baiDieuKhienId', baiDieuKhienIdValue.toString());


        const response = await http.put(`/api/baidieukhien/update/${payload.videoId}/${payload.baiDieuKhienId}`, formData);
        return response.data;


    }
);


export const deleteVideoFromDieuKhien = createAsyncThunk(
    'videoBaiDieuKhien/deleteVideoFromDieuKhien',
    async (payload: { videoId: number, baiDieuKhienId: number }) => {
        const response = await http.delete(`/api/baidieukhien/delete/${payload.videoId}/${payload.baiDieuKhienId}`);
        return response.data;
    }
);

const videoDieuKhienSlice = createSlice({
    name: 'videoBaiDieuKhien',
    initialState: initialListState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllDieuKhienWithVideo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchAllDieuKhienWithVideo.fulfilled, (state, action) => {
            state.dieuKhienWithVideos = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchAllDieuKhienWithVideo.rejected, (state, action) => {
            state.error = action.error.message || "Failed to fetch data";
            state.loading = false;
        });

        // fetchVideoByBaiGrammarId
        builder.addCase(fetchVideoByBaiDieuKhienId.fulfilled, (state, action) => {
            state.video = action.payload;
        })

        // Add video
        builder.addCase(addVideoToDieuKhien.fulfilled, (state, action) => {
            const camBien = state.dieuKhienWithVideos?.find(baiDieuKhien => baiDieuKhien.dieuKhienWithVideoDTO.dieuKhienId === action.payload.dieuKhienId);
            if (camBien) {
                camBien.videos.push(action.payload);
            }
        })

        // update video
        builder.addCase(updateVideoInDieuKhien.fulfilled, (state, action) => {
            if (state.dieuKhienWithVideos) {
                const index = state.dieuKhienWithVideos.findIndex(
                    (dieuKhien) => dieuKhien.dieuKhienWithVideoDTO.dieuKhienId === action.payload.dieuKhienId
                );
                if (index !== -1) {
                    const videoIndex = state.dieuKhienWithVideos[index].videos.findIndex(
                        (video) => video.id === action.payload.videoId
                    );
                    if (videoIndex !== -1) {
                        state.dieuKhienWithVideos[index].videos[videoIndex] = action.payload;
                    }
                }
            }
        })
        // delete video
        builder.addCase(deleteVideoFromDieuKhien.fulfilled, (state, action) => {
            if (state.dieuKhienWithVideos) {
                const index = state.dieuKhienWithVideos?.findIndex((dieuKhien) => dieuKhien.dieuKhienWithVideoDTO.dieuKhienId === action.payload.dieuKhienId);
                if (index !== -1) {
                    state.dieuKhienWithVideos[index].videos = state.dieuKhienWithVideos[index].videos.filter(
                        (video) => video.id !== action.payload.videoId
                    );
                }
            }
        });


    }
})

export default videoDieuKhienSlice.reducer;