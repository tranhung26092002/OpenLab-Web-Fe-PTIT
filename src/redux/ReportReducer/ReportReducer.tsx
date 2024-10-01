import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, http } from "../../util/config";

export interface Report {
    reportId: number;
    title: string;
    groupName: string;
    className: string;
    date: string;
    instructor: string;
    practiceSession: string;
    student: { id: number; name: string; studentId: string }
    grade: number;
    anhCamBien: string;
}


export interface ReportState {
    items: Report[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export const submitData = createAsyncThunk(
    'sensor/report',
    async (data: {
        title: string;
        group: string;
        nameClass: string;
        date: string;
        instructor: string;
        practiceSession: string;
        student: { name: string; id: string };
        image: File;
    }, thunkAPI) => {
        try {
            const response = await http.post(`/api/IoT/report/create`, data);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);

export const getAllReports = createAsyncThunk(
    'sensor/allReports',
    async () => {
        try {
            const response = await http.get(`/api/IoT/report/all`);
            return response.data;
        } catch (error: any) {
            return (error.response.data.message || 'Something went wrong!');
        }
    }
);

export const updateGrade = createAsyncThunk(
    'sensor/updateGrade',
    async (data: { reportId: number; grade: number }, thunkAPI) => {
        try {
            const response = await http.put(`/api/IoT/report/updateGrade/${data.reportId}?newGrade=${data.grade}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);

export const deleteReport = createAsyncThunk(
    'sensor/deleteReport',
    async (reportId: number, thunkAPI) => {
        try {
            const response = await http.delete(`/api/IoT/report/deleteReport/${reportId}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong!');
        }
    }
);

const initialState: ReportState = {
    items: [],
    status: 'idle',
    error: null as string | null,
};

const sensorReport = createSlice({
    name: 'sensorReport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(submitData.fulfilled, (state, action) => {
            state.items = action.payload;
            // history.push("/home/DashBoard/Sensor/Report");
        });

        builder.addCase(submitData.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            history.push("/home/Report");
        });

        builder.addCase(getAllReports.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload; // Cập nhật mảng reports với dữ liệu từ máy chủ
        })

        builder.addCase(getAllReports.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Unknown error';
        });

        builder.addCase(updateGrade.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const updatedReport = action.payload; // Đảm bảo action.payload chứa báo cáo đã được cập nhật từ máy chủ
            state.items = state.items.map(report => {
                if (report.reportId === updatedReport.reportId) {
                    return updatedReport;
                } else {
                    return report;
                }
            });
        });
        
        builder.addCase(deleteReport.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const deletedReportId = action.payload; // Đảm bảo action.payload chứa reportId của báo cáo đã bị xóa
            state.items = state.items.filter(report => report.reportId !== deletedReportId);
        });
        
    }
})

export default sensorReport.reducer;
