import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserReducer/UserReducer";
import BaiIoTReducer from "./BaiIoT/BaiIoTReducer";
import CommentBaiKhoiNguon from "./CommentBaiIoT/CommentBaiKhoiNguon";
import SensorBlockReducer from "./NodeBlockReducer/NodeBlockReducer";
import ReportReducer from "./ReportReducer/ReportReducer";
import ControllerBlockReducer from "./GatewayBlockReducer/GatewayBlockReducer";
import PeripheralBlockReducer from "./CloudBlockReducer/CloudBlockReducer";
import CommentBaiKhoiCamBien from "./CommentBaiIoT/CommentBaiKhoiCamBien";
import CommentBaiKhoiDieuKhien from "./CommentBaiIoT/CommentBaiKhoiDieuKhien";
import CommentBaiKhoiNgoaiVi from "./CommentBaiIoT/CommentBaiKhoiNgoaiVi";
import VideoGrammarReducer from "./VideoGrammar/VideoGrammarReducer";
import VideoCamBienReducer from "./VideoNode/VideoNodeReducer";
import VideoDieuKhienReducer from "./VideoGateway/VideoGatewayReducer";
import VideoBaiNgoaiViReducer from "./VideoBaiCloudReducer/VideoBaiCloudReducer";





export const store = configureStore({
    reducer: {
        UserReducer,

        BaiIoTReducer,
        SensorBlockReducer,
        ControllerBlockReducer,
        PeripheralBlockReducer,
        ReportReducer,

        CommentBaiKhoiNguon,
        CommentBaiKhoiCamBien,
        CommentBaiKhoiDieuKhien,
        CommentBaiKhoiNgoaiVi,

        VideoGrammarReducer,
        VideoCamBienReducer,
        VideoDieuKhienReducer,
        VideoBaiNgoaiViReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type DispatchType = typeof store.dispatch