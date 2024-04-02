import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";



export interface KhoiDieuKhienItem {
    dieukhienId: number;
    tenDieuKhien: string;
    anhDieuKhien: string;
    contentHtml: string;
}


export interface BaiDieuKhienState {
    items: KhoiDieuKhienItem[];
    searchResult: SearchResponse;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    currentItem: KhoiDieuKhienItem | null;
}

export interface UpdatePayload {
    id: string,
    data: {
        image: File;
        tenKhoiDieuKhien: string;
        contentHTML: File;
    }
}
export interface SearchResponse {
    status: number;
    message: string;
    data: KhoiDieuKhienItem[];
}

const initialState: BaiDieuKhienState = {
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

export const fetchKhoiDieuKhienPaginated = createAsyncThunk(
    'controllerBlock/fetchPaginated',
    async (params: { page: number, size: number }) => {
        const response = await http.get(`/api/dieukhien`, { params });
        return response.data;
    }
);


export const createBaiKhoiDieuKhien = createAsyncThunk(
    'controllerBlock/create',
    async (data: { tenKhoiDieuKhien: string; image: File; contentHTML: File }, thunkAPI) => {
        console.log("file image", data.image);
        console.log("file doc", data.contentHTML);

        const formData = new FormData();
        formData.append('file', data.image);
        formData.append('tenKhoiDieuKhien', data.tenKhoiDieuKhien);
        formData.append('contentHTML', data.contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.post(`/admin/IoT/dieukhien/create`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateBaiDieuKhien = createAsyncThunk(
    'controllerBlock/update',
    async ({ id, data: { image, tenKhoiDieuKhien, contentHTML } }: UpdatePayload, thunkAPI) => {
        console.log("file image", image);
        console.log("file doc", contentHTML);

        const formData = new FormData();
        formData.append('file', image);
        formData.append('tenKhoiDieuKhien', tenKhoiDieuKhien);
        formData.append('contentHTML', contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.put(`/admin/IoT/dieukhien/update/${id}`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const deleteBaiKhoiDieuKhien = createAsyncThunk<string, string>(
    'controllerBlock/delete',
    async (id: string) => {
        await http.delete(`/admin/IoT/dieukhien/delete/${id}`);
        return id;
    }
);

export const fetchAllBaiKhoiDieuKhien = createAsyncThunk(
    'controllerBlock/fetchAll',
    async () => {
        const response = await http.get('/api/dieukhien/all');
        console.log("allBaiKhoiDieuKhien", response);
        return response.data.data;
    }
);

export const searchBaiKhoiDieuKhien = createAsyncThunk(
    'controllerBlock/search',
    async (searchItem: string) => {
        const response = await http.get(`/api/dieukhien/search?search=${encodeURIComponent(searchItem)}`);
        return response.data;
    }
);

export const fetchBaiKhoiDieuKhienDetail = createAsyncThunk(
    'controllerBlock/fetchDetail',
    async (id: number) => {
        const response = await http.get(`/api/dieukhien/${id}`);
        return response.data;
    }
)


const controllerBlockSlice = createSlice({
    name: 'controllerBlock',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch baiIoT
        builder.addCase(fetchKhoiDieuKhienPaginated.fulfilled, (state, action) => {
            state.items = action.payload.data;
            state.totalItems = action.payload.total;
        });

        // Create baiIoT
        builder.addCase(createBaiKhoiDieuKhien.fulfilled, (state, action) => {
            if (!Array.isArray(state.items)) {
                state.items = [];
            }
            state.items.push(action.payload);
            history.push("/admin");
        });

        builder.addCase(createBaiKhoiDieuKhien.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            history.push("/admin");
        });

        //Fetch all baiIoT
        builder.addCase(fetchAllBaiKhoiDieuKhien.fulfilled, (state, action) => {
            state.items = action.payload;
        });

        // Update baiIoT
        builder.addCase(updateBaiDieuKhien.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.dieukhienId === action.payload.dieukhienId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });
        builder.addCase(updateBaiDieuKhien.rejected, (state, action) => {
            if (action.error.message) {
                state.error = action.error.message;
            } else {
                state.error = 'Unknown error';
            }
        });

        // Delete baiIoT
        builder.addCase(deleteBaiKhoiDieuKhien.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.dieukhienId !== parseInt(action.payload));
        })
        builder.addCase(deleteBaiKhoiDieuKhien.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
        });

        // search baiIoT
        builder.addCase(searchBaiKhoiDieuKhien.fulfilled, (state, action) => {
            state.searchResult = action.payload;
        })

        builder.addCase(fetchBaiKhoiDieuKhienDetail.fulfilled, (state, action) => {
            state.status = action.payload.status;
            state.currentItem = action.payload.data;
        })
    }
})

export default controllerBlockSlice.reducer;