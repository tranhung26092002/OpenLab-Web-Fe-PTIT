import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import style from './DashBoard.module.scss'; // Import file SCSS
import * as Icon from '@mui/icons-material';
import 'firebase/database'; // Import module cho Firebase Database

const DashBoard = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Đường dẫn bạn muốn chuyển đến khi bấm vào nút button
        const newPath = '/home/DashBoard/Sensor';

        // Chuyển hướng đến trang mới
        navigate(newPath);
    };

    const SensorBlock: React.FC<{ title: string, icon: any }> = ({ title, icon }) => (
        <div className={style.Block}>
            {React.createElement(icon, { fontSize: 'large' })}
            <div className={style.Info}>
                <h4>{title}</h4>
                <button onClick={handleButtonClick}>Hiển thị chi tiết</button>
            </div>
        </div>
    );
    const handleControllerButton = () => {
        // Đường dẫn bạn muốn chuyển đến khi bấm vào nút button
        const newPath = '/home/DashBoard/Actuator';

        // Chuyển hướng đến trang mới
        navigate(newPath);
    };

    const ControllerBlock: React.FC<{ title: string, icon: any }> = ({ title, icon }) => (
        <div className={style.Block}>
            {React.createElement(icon, { fontSize: 'large' })}
            <div className={style.Info}>
                <h4>{title}</h4>
                <button onClick={handleControllerButton}>Hiển thị chi tiết</button>
            </div>
        </div>
    );

    //KeyPad
    const [currentNumber, setCurrentNumber] = useState('');

    const handleNumberClick = (number: string | number) => {
        setCurrentNumber(currentNumber + String(number));
    };

    const handleClearClick = () => {
        setCurrentNumber('');
    };

    const handleSendClick = () => {
        // Đoạn mã để xử lý việc gửi số đã nhập
        console.log('Số đã nhập: ', currentNumber);
    };

    //Connect
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    const handleConnect = () => {
        if (connectionStatus === 'Disconnected') {
            // Thực hiện logic kết nối ở đây
            // Ví dụ: gửi yêu cầu kết nối đến server và xử lý phản hồi
            // Ở đây chỉ đơn giản là cập nhật trạng thái kết nối
            setConnectionStatus('Connected');
        } else {
            // Thực hiện logic ngắt kết nối ở đây nếu cần
            // Ở đây chỉ đơn giản là cập nhật trạng thái kết nối
            setConnectionStatus('Disconnected');
        }
    };

    return (
        <Fragment>
            <Header />
            <div>
                <h2>DashBoard</h2>
                <div className={style.Container}>
                    <div className={style.LeftContainer}>
                        <h3>Khối cảm biến</h3>
                        <div className={style.SensorGrid}>
                            <SensorBlock title="Nhiệt độ" icon={Icon.ThermostatOutlined} />
                        </div>
                    </div>
                    <div className={style.MidContainer}>
                        <h3>Khối chấp hành</h3>
                        <div className={style.SensorGrid}>
                            <ControllerBlock title="Còi" icon={Icon.NotificationsActiveOutlined} />
                        </div>
                    </div>
                    <div className={style.RightContainer}>
                        <h3>Khối nguồn</h3>
                        <div className={style.ConnectionBlock}>
                            <div className={style.InputContainer}>
                                <label htmlFor="url">Vol:</label>
                                <input className={style.Input} type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                            <div className={style.InputContainer}>
                                <label htmlFor="key">Amp:</label>
                                <input className={style.Input} type="text" id="key" value={key} onChange={(e) => setKey(e.target.value)} />
                            </div>
                            <button className={style.ConnectionButton} onClick={handleConnect}>
                                {connectionStatus === 'Disconnected' ? 'Connect' : 'Disconnect'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={style.Container}>
                    <div className={style.LeftContainer}>
                        <h3>Khối bàn phím</h3>
                        <div className={style.KeyPadContainer}>
                            <div className={style.Screen}>
                                <input type="text" value={"Nhập số:" + currentNumber} readOnly />
                            </div>
                            <div className={style.KeyPad}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#', 'Clear', 'Send'].map((item) => (
                                    <button key={item} onClick={() => {
                                        if (typeof item === 'number' || item === '*' || item === '#') {
                                            handleNumberClick(item);
                                        } else if (item === 'Clear') {
                                            handleClearClick();
                                        } else if (item === 'Send') {
                                            handleSendClick();
                                            handleClearClick();
                                        }
                                    }}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={style.RightContainer}>
                        <h3>Khối kết nối</h3>
                        <div className={style.ConnectionBlock}>
                            <button className={style.ConnectionButton} disabled>{connectionStatus}</button>
                            <div className={style.InputContainer}>
                                <label htmlFor="url">URL:</label>
                                <input className={style.Input} type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                            <div className={style.InputContainer}>
                                <label htmlFor="key">KEY:</label>
                                <input className={style.Input} type="text" id="key" value={key} onChange={(e) => setKey(e.target.value)} />
                            </div>
                            <button className={style.ConnectionButton} onClick={handleConnect}>
                                {connectionStatus === 'Disconnected' ? 'Connect' : 'Disconnect'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}
export default DashBoard;
