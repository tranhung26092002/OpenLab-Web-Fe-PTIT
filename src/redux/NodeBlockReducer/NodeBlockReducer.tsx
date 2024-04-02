import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";



export interface KhoiCamBienItem {
    camBienId: number;
    tenCambien: string;
    anhCamBien: string;
    contentHtml: string;
}


export interface BaiCamBienState {
    items: KhoiCamBienItem[];
    searchResult: SearchResponse;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    currentItem: KhoiCamBienItem | null;
}

export interface UpdatePayload {
    id: string,
    data: {
        image: File;
        tenKhoiCamBien: string;
        contentHTML: File;
    }
}
export interface SearchResponse {
    status: number;
    message: string;
    data: KhoiCamBienItem[];
}

const initialState: BaiCamBienState = {
    items: [],
    searchResult: {
        status: 0,
        message: '',
        data: []
    },
    status: 'idle',
    error: null || "Unknown",
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 2,
    currentItem: null
};

export const fetchKhoiCamBienPaginated = createAsyncThunk(
    'sensorBlock/fetchPaginated',
    async (params: { page: number, size: number }) => {
        const response = await http.get(`/api/cambien`, { params });
        return response.data;
    }
);


export const createBaiKhoiCamBien = createAsyncThunk(
    'sensorBlock/create',
    async (data: { tenKhoiCamBien: string; image: File; contentHTML: File }, thunkAPI) => {
        console.log("file image", data.image);
        console.log("file doc", data.contentHTML);

        const formData = new FormData();
        formData.append('file', data.image);
        formData.append('tenKhoiCamBien', data.tenKhoiCamBien);
        formData.append('contentHTML', data.contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.post(`/admin/IoT/cambien/create`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateBaiCamBien = createAsyncThunk(
    'sensorBlock/update',
    async ({ id, data: { image, tenKhoiCamBien, contentHTML } }: UpdatePayload, thunkAPI) => {
        console.log("file image", image);
        console.log("file doc", contentHTML);

        const formData = new FormData();
        formData.append('file', image);
        formData.append('tenKhoiCamBien', tenKhoiCamBien);
        formData.append('contentHTML', contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.put(`/admin/IoT/cambien/update/${id}`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const deleteBaiKhoiCamBien = createAsyncThunk<string, string>(
    'sensorBlock/delete',
    async (id: string) => {
        await http.delete(`/admin/IoT/cambien/delete/${id}`);
        return id;
    }
);

export const fetchAllBaiKhoiCamBien = createAsyncThunk(
    'sensorBlock/fetchAll',
    async () => {
        const response = await http.get('/api/cambien/all');
        console.log("allBaiKhoiCamBien", response);
        return response.data.data;
    }
);

export const searchBaiKhoiCamBien = createAsyncThunk(
    'sensorBlock/search',
    async (searchItem: string) => {
        const response = await http.get(`/api/cambien/search?search=${encodeURIComponent(searchItem)}`);
        return response.data;
    }
);

export const fetchBaiKhoiCamBienDetail = createAsyncThunk(
    'sensorBlock/fetchDetail',
    async (id: number) => {
        const response = await http.get(`/api/cambien/${id}`);
        return response.data;
    }
)


const sensorBlockSlice = createSlice({
    name: 'sensorBlock',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch baiIoT
        builder.addCase(fetchKhoiCamBienPaginated.fulfilled, (state, action) => {
            state.items = action.payload.data;
            state.totalItems = action.payload.total;
        });

        // Create baiIoT
        builder.addCase(createBaiKhoiCamBien.fulfilled, (state, action) => {
            if (!Array.isArray(state.items)) {
                state.items = [];
            }
            state.items.push(action.payload);
            history.push("/admin");
        });

        builder.addCase(createBaiKhoiCamBien.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            history.push("/admin");
        });

        //Fetch all baiIoT
        builder.addCase(fetchAllBaiKhoiCamBien.fulfilled, (state, action) => {
            state.items = action.payload;
        });

        // Update baiIoT
        builder.addCase(updateBaiCamBien.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.camBienId === action.payload.baiGrammarId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });
        builder.addCase(updateBaiCamBien.rejected, (state, action) => {
            if (action.error.message) {
                state.error = action.error.message;
            } else {
                state.error = 'Unknown error';
            }
        });

        // Delete baiIoT
        builder.addCase(deleteBaiKhoiCamBien.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.camBienId !== parseInt(action.payload));
        })
        builder.addCase(deleteBaiKhoiCamBien.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
        });

        // search baiIoT
        builder.addCase(searchBaiKhoiCamBien.fulfilled, (state, action) => {
            state.searchResult = action.payload;
        })

        builder.addCase(fetchBaiKhoiCamBienDetail.fulfilled, (state, action) => {
            state.status = action.payload.status;
            state.currentItem = action.payload.data;
        })
    }
})

export default sensorBlockSlice.reducer;