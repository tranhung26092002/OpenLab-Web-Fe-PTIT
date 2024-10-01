import React, { Fragment, useState, useEffect } from 'react';
import styles from './DeviceManager.module.scss';
import Header from '../../../components/Header/Header';
import { NavLink } from 'react-router-dom';
import Footer from '../../../components/Footer/Footer';
import { Client } from 'paho-mqtt';

const DeviceManager = () => {
    // Thông tin của broker MQTT
    const host = "192.168.1.82";
    const port = "9001";
    const clientId = "ClientID";
    const user = "hungtran";
    const password = "hungtran";

    // State
    const [topicSub, setTopicSub] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [devices, setDevices] = useState<{ name: string; value: string }[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    // Kết nối tới broker MQTT
    const connectToBroker = () => {
        if (client && client.isConnected()) {
            client.disconnect();
            setConnectionStatus('Disconnected');
            setTopicSub('');
            return;
        }

        const newClient = new Client(host, parseInt(port), clientId);
        newClient.onConnectionLost = onConnectionLost;

        const connectOptions = {
            onSuccess: onConnect,
            userName: user,
            password: password
        };

        newClient.connect(connectOptions);

        setClient(newClient);
    }

    // Xử lý khi kết nối thành công
    const onConnect = () => {
        console.log('Connected to MQTT broker.');
        setConnectionStatus('Connected');
    }

    // Xử lý khi mất kết nối
    const onConnectionLost = (responseObject: { errorCode: number; errorMessage: any; }) => {
        if (responseObject.errorCode !== 0) {
            console.log('Connection lost:', responseObject.errorMessage);
            setConnectionStatus('Disconnected');
        }
    }

    // Subscribe vào một topic
    const subscribeToTopic = () => {
        if (!client || !client.isConnected()) {
            console.error('Client is not initialized or not connected.');
            alert('Chưa kết nối tới MQTT Broker');
            return;
        }

        if (!topicSub) {
            console.error('Please provide topic.');
            alert('Chưa nhập topic!');
            return;
        }

        if (client && client.isConnected()) {
            client.subscribe(topicSub);
            console.log('Subscribed to topic ' + topicSub);
            alert('Subscribed to topic ' + topicSub);

            client.onMessageArrived = onMessageArrived;
        } else {
            console.error('Client is not initialized or not connected.');
            alert('Chưa kết nối tới MQTT Broker');
        }
    }

    // Xử lý khi nhận được tin nhắn
    const onMessageArrived = (message: {
        destinationName: string;
        payloadString: string;
    }) => {
        console.log('Received message:', message.payloadString);
        const topic = message.destinationName; // Lấy topic của tin nhắn
        const value = message.payloadString; // Lấy giá trị của tin nhắn

        // Kiểm tra xem thiết bị đã tồn tại trong danh sách hay chưa
        const existingDeviceIndex = devices.findIndex(device => device.name === topic);
        if (existingDeviceIndex !== -1) {
            // Nếu thiết bị đã tồn tại, cập nhật giá trị của nó
            setDevices(prevDevices => {
                const updatedDevices = [...prevDevices];
                updatedDevices[existingDeviceIndex].value = value;
                return updatedDevices;
            });
        } else {
            // Nếu thiết bị chưa tồn tại, thêm mới vào danh sách
            setDevices(prevDevices => [...prevDevices, { name: topic, value }]);
        }
    }

    useEffect(() => {
        connectToBroker();
    }, []);

    return (
        <Fragment>
            <Header />
            <h2>Quản lý thiết bị</h2>
            <div className={styles.container}>
                <p>Status: {connectionStatus}</p>
                <div className={styles.contentSection}>
                    <div className={styles.contentText}>
                        <input
                            type="text"
                            value={topicSub}
                            onChange={(e) => setTopicSub(e.target.value)}
                            placeholder="Nhập ID thiết bị"
                        />
                        <button onClick={subscribeToTopic}>Thêm thiết bị</button>
                    </div>
                    <div className={styles.deviceList}>
                        <h3>Danh sách thiết bị</h3>
                        <ul>
                            {devices.map((device, index) => (
                                <li key={index}>
                                    <strong>{device.name}:</strong> {device.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default DeviceManager;
