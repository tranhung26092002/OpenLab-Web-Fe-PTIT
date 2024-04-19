import React, { useState, useEffect, Fragment } from 'react';
import styles from './BrokerMQTT.module.scss';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Client, Message  } from 'paho-mqtt';

const MqttClient = () => { 
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [clientId, setClientId] = useState('');
    const [topicSub, setTopicSub] = useState('');
    const [topicPub, setTopicPub] = useState('');
    const [message, setMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [data, setData] = useState('');
    const [user, setUser] = useState(''); // Thêm state cho user
    const [password, setPassword] = useState(''); // Thêm state cho password
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        if (client && client.isConnected() && topicSub) {
            client.subscribe(topicSub);
            console.log('Subscribed to topic ' + topicSub);

            client.onMessageArrived = onMessageArrived;
        }

        return () => {
            if (client && client.isConnected()) {
                client.unsubscribe(topicSub);
                console.log('Unsubscribed from topic ' + topicSub);
            }
        };
    }, [client, topicSub]);

    useEffect(() => {
        return () => {
            if (client && client.isConnected()) {
                client.disconnect();
                setConnectionStatus('Disconnected');
            }
        };
    }, [client]);

    const connectToBroker = () => {
        if (!host || !port || !clientId || !user || !password) {
            alert('Please enter host, port, clientId, user, and password!');
            return;
        }

        if (client && client.isConnected()) {
            client.disconnect();
            setConnectionStatus('Disconnected');
            setData('');
            setTopicSub('');
            setTopicPub('');
            setMessage('');
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

    const onConnect = () => {
        console.log('Connected to MQTT broker.');
        setConnectionStatus('Connected');
    }

    const onConnectionLost = (responseObject: { errorCode: number; errorMessage: any; }) => {
        if (responseObject.errorCode !== 0) {
            console.log('Connection lost:', responseObject.errorMessage);
            setConnectionStatus('Disconnected');
        }
    }

    const onMessageArrived = (message: { payloadString: string }) => {
        console.log('Received message:', message.payloadString);
        setData(message.payloadString); // Sử dụng dữ liệu chuỗi trực tiếp
        try {
            const data = JSON.parse(message.payloadString); // Chuyển chuỗi thành đối tượng JavaScript
            // updateSensorReadings(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

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

            client.onMessageArrived = onMessageArrived;
        } else {
            console.error('Client is not initialized or not connected.');
            alert('Chưa kết nối tới MQTT Broker');
        }
    }

    const unsubscribeFromTopic = () => {
        if (client && client.isConnected()) {
            client.unsubscribe(topicSub);
            console.log('Unsubscribed from topic ' + topicSub);
            setData('');
            setTopicSub('');
        } else {
            console.error('Client is not initialized or not connected.');
        }
    }

    const sendMessage = () => {
        if (!client || !client.isConnected()) {
            console.error('Client is not initialized or not connected.');
            alert('Chưa kết nối tới MQTT Broker');
            return;
        }
    
        if (!topicPub || !message) {
            console.error('Please provide both topic and message.');
            alert('Chưa nhập topic và message!');
            return;
        }
    
        const mqttMessage = new Message(message); // Use Message class directly
        mqttMessage.destinationName = topicPub;
        client.send(mqttMessage);
        console.log('Message sent to topic ' + topicPub);
    }

    return (
        <Fragment>
            <Header />
            <div className={styles.container}>
                <div className={styles.client_container}>
                    <h2>MQTT Client</h2>
                    <div className={styles.status_connection}>
                        Connection Status: {connectionStatus}
                    </div>
                    <div className={styles.input_container}>
                        <label>Host:</label>
                        <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
                    </div>
                    <div className={styles.input_container}>
                        <label>Port:</label>
                        <input type="text" value={port} onChange={(e) => setPort(e.target.value)} />
                    </div>
                    <div className={styles.input_container}>
                        <label>Client ID:</label>
                        <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} />
                    </div>
                    <div className={styles.input_container}>
                        <label>User:</label> 
                        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                    </div>
                    <div className={styles.input_container}>
                        <label>Password:</label> 
                        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={connectToBroker}>
                        {connectionStatus === 'Connected' ? 'Disconnect' : 'Connect'}
                    </button>
                    <div className={styles.input_container}>
                        <label>Topic to Subscribe:</label>
                        <input type="text" value={topicSub} onChange={(e) => setTopicSub(e.target.value)} />
                    </div>
                    <div className={styles.input_container}>
                        <button onClick={subscribeToTopic}>
                            Subscribe
                        </button>
                        <button onClick={unsubscribeFromTopic}>
                            Unsubscribe
                        </button>
                    </div>
                    <div className={styles.input_container}>
                        <label>Data Subscribed:</label>
                        <span>{data}</span>
                    </div>
                    <div className={styles.input_container}>
                        <label>Topic to Publish:</label>
                        <input type="text" value={topicPub} onChange={(e) => setTopicPub(e.target.value)} />
                    </div>
                    <div className={styles.input_container}>
                        <label>Message:</label>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                    <button onClick={sendMessage}>Publish</button>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default MqttClient;
