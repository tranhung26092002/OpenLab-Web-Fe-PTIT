import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";

export interface SensorReport {
    reportId: number;
    temperature: number;
    humidity: number;
    gas: number;
    light: number;
    title: string;
    groupName: string;
    className: string;
    date: string;
    instructor: string;
    practiceSession: string;
    students: { id: number; name: string; studentId: string }[]
}


export interface SensorReportState {
    items: SensorReport[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const submitSensorData = createAsyncThunk(
    'sensor/report',
    async (data: {
        temperature: number;
        humidity: number;
        gas: number;
        light: number;
        title: string;
        group: string;
        nameClass: string;
        date: string;
        instructor: string;
        practiceSession: string;
        students: { name: string; id: string }[]
    }, thunkAPI) => {
        try {
            const response = await http.post(`/api/IoT/sensor/report/create`, data);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);

export const getAllSensorReports = createAsyncThunk(
    'sensor/allReports',
    async () => {
        try {
            const response = await http.get(`/api/IoT/sensor/report/all`);
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            return (error.response.data.message || 'Something went wrong!');
        }
    }
);

const initialState: SensorReportState = {
    items: [],
    status: 'idle',
    error: null as string | null,
};

const sensorReport = createSlice({
    name: 'sensorReport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(submitSensorData.fulfilled, (state, action) => {
            state.items = action.payload;
            // history.push("/home/DashBoard/Sensor/Report");
        });

        builder.addCase(submitSensorData.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            history.push("/home/DashBoard");
        });

        builder.addCase(getAllSensorReports.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload.data; // Cập nhật mảng reports với dữ liệu từ máy chủ
        })
        builder.addCase(getAllSensorReports.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Unknown error';
        });
    }
})

export default sensorReport.reducer;
