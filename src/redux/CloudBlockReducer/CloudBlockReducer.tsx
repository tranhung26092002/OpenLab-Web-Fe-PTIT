import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";



export interface KhoiNgoaiViItem {
    ngoaiViId: number;
    tenNgoaiVi: string;
    anhNgoaiVi: string;
    contentHtml: string;
}


export interface BaiNgoaiViState {
    items: KhoiNgoaiViItem[];
    searchResult: SearchResponse;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    currentItem: KhoiNgoaiViItem | null;
}

export interface UpdatePayload {
    id: string,
    data: {
        image: File;
        tenKhoiNgoaiVi: string;
        contentHTML: File;
    }
}
export interface SearchResponse {
    status: number;
    message: string;
    data: KhoiNgoaiViItem[];
}

const initialState: BaiNgoaiViState = {
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

export const fetchKhoiNgoaiViPaginated = createAsyncThunk(
    'peripheralBlock/fetchPaginated',
    async (params: { page: number, size: number }) => {
        const response = await http.get(`/api/ngoaivi`, { params });
        return response.data;
    }
);


export const createBaiKhoiNgoaiVi = createAsyncThunk(
    'peripheralBlock/create',
    async (data: { tenKhoiNgoaiVi: string; image: File; contentHTML: File }, thunkAPI) => {
        console.log("file image", data.image);
        console.log("file doc", data.contentHTML);

        const formData = new FormData();
        formData.append('file', data.image);
        formData.append('tenKhoiNgoaiVi', data.tenKhoiNgoaiVi);
        formData.append('contentHTML', data.contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.post(`/admin/IoT/ngoaivi/create`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateBaiNgoaiVi = createAsyncThunk(
    'peripheralBlock/update',
    async ({ id, data: { image, tenKhoiNgoaiVi, contentHTML } }: UpdatePayload, thunkAPI) => {
        console.log("file image", image);
        console.log("file doc", contentHTML);

        const formData = new FormData();
        formData.append('file', image);
        formData.append('tenKhoiNgoaiVi', tenKhoiNgoaiVi);
        formData.append('contentHTML', contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.put(`/admin/IoT/ngoaivi/update/${id}`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const deleteBaiKhoiNgoaiVi = createAsyncThunk<string, string>(
    'peripheralBlock/delete',
    async (id: string) => {
        await http.delete(`/admin/IoT/ngoaivi/delete/${id}`);
        return id;
    }
);

export const fetchAllBaiKhoiNgoaiVi = createAsyncThunk(
    'peripheralBlock/fetchAll',
    async () => {
        const response = await http.get('/api/ngoaivi/all');
        console.log("allBaiKhoiNgoaiVi", response);
        return response.data.data;
    }
);

export const searchBaiKhoiNgoaiVi = createAsyncThunk(
    'peripheralBlock/search',
    async (searchItem: string) => {
        const response = await http.get(`/api/ngoaivi/search?search=${encodeURIComponent(searchItem)}`);
        return response.data;
    }
);

export const fetchBaiKhoiNgoaiViDetail = createAsyncThunk(
    'peripheralBlock/fetchDetail',
    async (id: number) => {
        const response = await http.get(`/api/ngoaivi/${id}`);
        return response.data;
    }
)


const peripheralBlockSlice = createSlice({
    name: 'peripheralBlock',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch baiIoT
        builder.addCase(fetchKhoiNgoaiViPaginated.fulfilled, (state, action) => {
            state.items = action.payload.data;
            state.totalItems = action.payload.total;
        });

        // Create baiIoT
        builder.addCase(createBaiKhoiNgoaiVi.fulfilled, (state, action) => {
            if (!Array.isArray(state.items)) {
                state.items = [];
            }
            state.items.push(action.payload);
            history.push("/admin");
        });

        builder.addCase(createBaiKhoiNgoaiVi.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            history.push("/admin");
        });

        //Fetch all baiIoT
        builder.addCase(fetchAllBaiKhoiNgoaiVi.fulfilled, (state, action) => {
            state.items = action.payload;
        });

        // Update baiIoT
        builder.addCase(updateBaiNgoaiVi.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.ngoaiViId === action.payload.ngoaiViId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });
        builder.addCase(updateBaiNgoaiVi.rejected, (state, action) => {
            if (action.error.message) {
                state.error = action.error.message;
            } else {
                state.error = 'Unknown error';
            }
        });

        // Delete baiIoT
        builder.addCase(deleteBaiKhoiNgoaiVi.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.ngoaiViId !== parseInt(action.payload));
        })
        builder.addCase(deleteBaiKhoiNgoaiVi.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
        });

        // search baiIoT
        builder.addCase(searchBaiKhoiNgoaiVi.fulfilled, (state, action) => {
            state.searchResult = action.payload;
        })

        builder.addCase(fetchBaiKhoiNgoaiViDetail.fulfilled, (state, action) => {
            state.status = action.payload.status;
            state.currentItem = action.payload.data;
        })
    }
})

export default peripheralBlockSlice.reducer;