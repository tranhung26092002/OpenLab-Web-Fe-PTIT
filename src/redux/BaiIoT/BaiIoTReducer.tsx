import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DOMAIN, history, http } from "../../util/config";
import { stat } from "fs";


export interface BaiIoTItem {
    baiGrammarId: number;
    tenBaiGrammar: string;
    anhBaiGrammar: string;
    contentHTML: string;
}


export interface BaiIoTState {
    items: BaiIoTItem[];
    searchResult: SearchResponse;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    currentItem: BaiIoTItem | null;
}

export interface UpdatePayload {
    id: string,
    data: {
        image: File;
        tenBaiGrammar: string;
        contentHTML: File;
    }
}
export interface SearchResponse {
    status: number;
    message: string;
    data: BaiIoTItem[];
}

const initialState: BaiIoTState = {
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

export const fetchBaiIoTPaginated = createAsyncThunk(
    'baiIoT/fetchPaginated',
    async (params: { page: number, size: number }) => {
        const response = await http.get(`/api/grammar`, { params });
        return response.data;
    }
);


export const createBaiIoT = createAsyncThunk(
    'baiIoT/create',
    async (data: { tenBaiGrammar: string; image: File; contentHTML: File }, thunkAPI) => {
        console.log("file image", data.image);
        console.log("file doc", data.contentHTML);

        const formData = new FormData();
        formData.append('file', data.image);
        formData.append('tenBaiGrammar', data.tenBaiGrammar);
        formData.append('contentHTML', data.contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.post(`/admin/IoT/create`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const updateBaiIoT = createAsyncThunk(
    'baiIoT/update',
    async ({ id, data: { image, tenBaiGrammar, contentHTML } }: UpdatePayload, thunkAPI) => {
        console.log("file image", image);
        console.log("file doc", contentHTML);

        const formData = new FormData();
        formData.append('file', image);
        formData.append('tenBaiGrammar', tenBaiGrammar);
        formData.append('contentHTML', contentHTML);

        const allData = formData.getAll('file');
        console.log("abc", allData); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        const allDataDemo = formData.getAll('contentHTML');
        console.log("abcdemo", allDataDemo); // Điều này sẽ cho bạn biết liệu file có được thêm vào `FormData` hay không.

        // for (let [key, value] of formData.entries()) {
        //     console.log("formdata", key, value);
        // }

        try {
            const response = await http.put(`/admin/IoT/update/${id}`, formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);



export const deleteBaiIoT = createAsyncThunk<string, string>(
    'baiIoT/delete',
    async (id: string) => {
        await http.delete(`/admin/IoT/delete/${id}`);
        return id;
    }
);

export const fetchAllBaiIoT = createAsyncThunk(
    'baiIoT/fetchAll',
    async () => {
        const response = await http.get('/api/grammar/all');
        console.log("allBaiIoT", response);
        return response.data.data;
    }
);

export const searchBaiIoT = createAsyncThunk(
    'baiIoT/search',
    async (searchItem: string) => {
        const response = await http.get(`/api/grammar/search?search=${encodeURIComponent(searchItem)}`);
        return response.data;
    }
);

export const fetchBaiIoTDetail = createAsyncThunk(
    'baiIoT/fetchDetail',
    async (id: number) => {
        const response = await http.get(`/api/grammar/${id}`);
        return response.data;
    }
)


const baiIoTSlice = createSlice({
    name: 'baiIoT',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch baiIoT
        builder.addCase(fetchBaiIoTPaginated.fulfilled, (state, action) => {
            state.items = action.payload.data;
            state.totalItems = action.payload.total;
        });

        // Create baiIoT
        builder.addCase(createBaiIoT.fulfilled, (state, action) => {
            if (!Array.isArray(state.items)) {
                state.items = [];
            }
            state.items.push(action.payload);
            history.push("/admin");
        });

        builder.addCase(createBaiIoT.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            history.push("/admin");
        });

        //Fetch all baiIoT
        builder.addCase(fetchAllBaiIoT.fulfilled, (state, action) => {
            state.items = action.payload;
        });

        // Update baiIoT
        builder.addCase(updateBaiIoT.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.baiGrammarId === action.payload.baiGrammarId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });
        builder.addCase(updateBaiIoT.rejected, (state, action) => {
            if (action.error.message) {
                state.error = action.error.message;
            } else {
                state.error = 'Unknown error';
            }
        });

        // Delete baiIoT
        builder.addCase(deleteBaiIoT.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.baiGrammarId !== parseInt(action.payload));
        })
        builder.addCase(deleteBaiIoT.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
        });

        // search baiIoT
        builder.addCase(searchBaiIoT.fulfilled, (state, action) => {
            state.searchResult = action.payload;
        })

        builder.addCase(fetchBaiIoTDetail.fulfilled, (state, action) => {
            state.status = action.payload.status;
            state.currentItem = action.payload.data;
        })
    }
})

export default baiIoTSlice.reducer;