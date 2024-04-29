import React, { useState, Fragment } from 'react';
import styles from './BrokerMQTT.module.scss';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Client, Message } from 'paho-mqtt';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as Icon from '@mui/icons-material';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Col, DatePicker, Row, notification, Select, Descriptions, List, InputNumber,Tag } from 'antd';
import { submitData } from '../../../redux/ReportReducer/ReportReducer';
import { useDispatch } from 'react-redux';
import { DispatchType } from '../../../redux/configStore';
const { Option } = Select;

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
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [gas, setGas] = useState(null);
    const [light, setLight] = useState(null);

    const [buzzerStatus, setBuzzerStatus] = useState<boolean>(false);
    const [fanStatus, setFanStatus] = useState<boolean>(false);
    const [ledStatus, setLedStatus] = useState<boolean>(false);
    const [servoStatus, setServoStatus] = useState<boolean>(false);


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
        alert('Connected to MQTT broker.');
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
            const data = JSON.parse(message.payloadString);
            setTemperature(data.temperature);
            setHumidity(data.humidity);
            setGas(data.gas);
            setLight(data.light);
            setBuzzerStatus(data.buzzer === 1);
            setFanStatus(data.fan === 1);
            setLedStatus(data.led === 1);
            setServoStatus(data.servo === 1);
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
            alert('Subscribed to topic ' + topicSub);

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
            alert('Unsubscribed to topic ' + topicSub);

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

    const sendMessageButton = (newMessage: string) => {
        if (!client || !client.isConnected()) {
            console.error('Client is not initialized or not connected.');
            alert('Chưa kết nối tới MQTT Broker');
            return;
        }

        if (!topicPub || !newMessage) {
            console.error('Please provide both topic and message.');
            alert('Chưa nhập topic và message!');
            return;
        }

        const mqttMessage = new Message(newMessage); // Use Message class directly
        mqttMessage.destinationName = topicPub;
        client.send(mqttMessage);
        console.log('Message sent to topic ' + topicPub);
    }

    const ChartBlock: React.FC<{ title: string, dataKey: string, data: any, color: string }> = ({ title, dataKey, data, color }) => (
        <div className={styles.Chart}>
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: title, [dataKey]: data }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit={dataKey === 'temperature' ? ' °C' : dataKey === 'humidity' ? ' %' : dataKey === 'gas' ? ' ppm' : dataKey === 'light' ? ' lux' : ''} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={dataKey} fill={color} barSize={100} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const SensorBlock: React.FC<{ title: string, topic: string, value: any, icon: any }> = ({ title, topic, value, icon }) => (
        <div className={styles.Block}>
            {React.createElement(icon, { fontSize: 'large' })}
            <div className={styles.Info}>
                <h4>{title}</h4>
                <p>Topic: {topic}</p>
                <p>Value: {value}</p>
            </div>
        </div>
    );

    const ActuatorBlock: React.FC<{
        title: string, icon: React.ReactNode, status: boolean,
        setStatus: React.Dispatch<React.SetStateAction<boolean>>, handleToggle: () => void;
    }> = ({ title, icon, status, handleToggle }) => (
        <div className={styles.Block}>
            {status ? icon : <Icon.HighlightOffOutlined fontSize="large" />}
            <div className={styles.Info}>
                <h4>{title}</h4>
            </div>
            <button onClick={() => {
                handleToggle();
                const newMessage = status ? '0' : '1';
                setMessage(newMessage);
                sendMessageButton(newMessage);
            }}>{status ? 'Tắt' : 'Bật'}</button>
        </div>
    );

    // Hàm xử lý toggle cho tất cả các actuator
    const handleToggle = (setStatus: React.Dispatch<React.SetStateAction<boolean>>, status: boolean) => {
        setStatus(prevStatus => !prevStatus);
    };

    // report

    const dispatch = useDispatch<DispatchType>();
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Use the useForm hook to get the form instance

    const handleSubmit = () => {
        // Lấy dữ liệu từ form
        const formData = form.getFieldsValue();
        const { title, group, nameClass, instructor, practiceSession } = formData;
        const formattedDate = formData.date ? dayjs(formData.date).format('YYYY-MM-DD') : ''; // Định dạng lại ngày tháng

        const studentName = formData[`studentName`];
        const studentId = formData[`studentId`];

        // Tiếp tục xử lý khi không có giá trị null
        const reportData = {
            title: title,
            group: group,
            nameClass: nameClass,
            date: formattedDate,
            instructor: instructor,
            practiceSession: practiceSession,
            student: { name: studentName, id: studentId } // Thêm thông tin về sinh viên vào đối tượng reportData
        };

        dispatch(submitData(reportData))
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: 'Created Successfully'
                });
                const newPath = `/home/Report`;
                // Chuyển hướng đến trang mới
                navigate(newPath);
            }).catch(() => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update sensor data'
                });
            });
    };

    const exercises = [
        { name: 'Buổi 1', content: 'THỰC HÀNH LẬP TRÌNH CƠ BẢN CHO VI ĐIỀU KHIỂN (STM32/ARDUINO)', evaluation: 'Đạt' },
        { name: 'Buổi 2', content: 'THỰC HÀNH GIAO TIẾP CẢM BIẾN-VI ĐIỀU KHIỂN-RELAY-BÓNG ĐÈN-MOTOR', evaluation: 'Không đạt' },
        { name: 'Buổi 3', content: 'THỰC HÀNH GIAO THỨC TRUYỀN NHẬN DỮ LIỆU SPI/I2C/UART', evaluation: 'Đạt' },
        { name: 'Buổi 4', content: 'THỰC HÀNH  MẠNG ZIGBEE', evaluation: 'Không đạt' },
        { name: 'Buổi 5', content: 'THỰC HÀNH MẠNG LORA', evaluation: 'Đạt' },
        { name: 'Buổi 6', content: 'THỰC HÀNH CLOUD', evaluation: 'Không đạt' },
        { name: 'Buổi 7', content: 'THỰC HÀNH ĐIỀU KHIỂN QUA SMART PHONE', evaluation: 'Đạt' },
    ];

    return (
        <Fragment>
            <Header />
            <div className={styles.Main}>
                <div className={styles.MQTTContainer}>
                    <div className={styles.client_container}>
                        <h2>MQTT Client</h2>
                        <div className={styles.connect_action_wrapper}>
                            <div className={styles.connect_container}>
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
                            </div>
                            <div className={styles.action_container}>
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
                                    <textarea
                                        value={data}
                                        readOnly
                                        rows={5} // Số dòng bạn muốn hiển thị
                                    />
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
                    </div>
                </div>
                <div className={styles.DashBoardContainer}>
                    <h2>DashBoard</h2>
                    <div className={styles.Container}>
                        <div className={styles.MainContainer}>
                            <h3>Actuator {topicSub}</h3>
                            <div className={styles.SensorGrid}>
                                <ActuatorBlock
                                    title="Còi"
                                    icon={<Icon.NotificationsActiveOutlined fontSize="large" />}
                                    status={buzzerStatus}
                                    setStatus={setBuzzerStatus}
                                    handleToggle={() => handleToggle(setBuzzerStatus, buzzerStatus)}
                                />
                                <ActuatorBlock
                                    title="Quạt"
                                    icon={<Icon.AirplanemodeActiveOutlined fontSize="large" />}
                                    status={fanStatus}
                                    setStatus={setFanStatus}
                                    handleToggle={() => handleToggle(setFanStatus, fanStatus)}
                                />
                                <ActuatorBlock
                                    title="Led"
                                    icon={<Icon.HighlightOutlined fontSize="large" />}
                                    status={ledStatus}
                                    setStatus={setLedStatus}
                                    handleToggle={() => handleToggle(setLedStatus, ledStatus)}
                                />
                                <ActuatorBlock
                                    title="Servo"
                                    icon={<Icon.AirplanemodeActiveOutlined fontSize="large" />}
                                    status={servoStatus}
                                    setStatus={setServoStatus}
                                    handleToggle={() => handleToggle(setServoStatus, servoStatus)}
                                />
                            </div>
                        </div>
                        <div className={styles.MainContainer}>
                            <h3>Sensor {topicSub}</h3>
                            <div className={styles.SensorGrid}>
                                <SensorBlock title={`Nhiệt độ`} topic={topicSub} value={`${temperature} °C`} icon={Icon.ThermostatOutlined} />
                                <SensorBlock title={`Độ ẩm`} topic={topicSub} value={`${humidity} %`} icon={Icon.OpacityOutlined} />
                                <SensorBlock title={`Khí gas`} topic={topicSub} value={`${gas} ppm`} icon={Icon.AirOutlined} />
                                <SensorBlock title={`Ánh sáng`} topic={topicSub} value={`${light} lux`} icon={Icon.LightModeOutlined} />
                            </div>
                        </div>
                        <div className={styles.ChartContainer}>
                            <h3>Chart {topicSub}</h3>
                            <div className={styles.ChartGrid}>
                                <ChartBlock title={`Nhiệt độ`} dataKey="temperature" data={temperature} color="#82ca9d" />
                                <ChartBlock title={`Độ ẩm`} dataKey="humidity" data={humidity} color="#8884d8" />
                                <ChartBlock title={`Khí gas`} dataKey="gas" data={gas} color="#ffc658" />
                                <ChartBlock title={`Ánh sáng`} dataKey="light" data={light} color="#ff7300" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.ReportContainer}>
                    <div className={styles.FormContainer}>
                        <Form layout="vertical" form={form}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <h2 className={styles.ReportTitle}>Report</h2>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={16}>
                                    <Form.Item name="title" label="Chọn đề tài cho bài thu hoặch cuối khóa">
                                        <Select placeholder="Chọn đề tài">
                                            <Option value="Đề tài 1: Hệ thống chiếu sáng thông minh">Đề tài 1: Hệ thống chiếu sáng thông minh</Option>
                                            <Option value="Đề tài 2: Hệ thống cảnh báo khí Gas thông minh">Đề tài 2: Hệ thống cảnh báo khí Gas thông minh</Option>
                                            <Option value="Đề tài 3: Hệ thống làm mát thông minh">Đề tài 3: Hệ thống làm mát thông minh</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="date" label="Ngày thực hành">
                                        <DatePicker format="DD/MM/YYYY" defaultValue={dayjs()} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Fragment>
                                    <Col span={8}>
                                        <Form.Item name="studentName" label="Họ và tên sinh viên">
                                            <Input placeholder="Nhập họ và tên sinh viên" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="studentId" label="Mã sinh viên">
                                            <Input placeholder="Nhập mã sinh viên" />
                                        </Form.Item>
                                    </Col>
                                </Fragment>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item name="group" label="Nhóm">
                                        <Input placeholder="Nhập nhóm" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="nameClass" label="Lớp">
                                        <Input placeholder="Nhập lớp" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item name="instructor" label="Giảng viên hướng dẫn">
                                        <Input placeholder="Nhập tên giảng viên hướng dẫn" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="practiceSession" label="Ca thực tập">
                                        <Input placeholder="Nhập ca thực tập" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <h3>Nội dung các bài thực hành:</h3>
                                    <List
                                        bordered
                                        dataSource={exercises}
                                        renderItem={item => (
                                            <List.Item>
                                                <Row gutter={[16, 16]} align="middle">
                                                    <Col span={6}>
                                                        <strong>{item.name}</strong>
                                                    </Col>
                                                    <Col span={20}>
                                                        {item.content}
                                                    </Col>
                                                    <Col span={4}>
                                                        <Tag color={item.evaluation === 'Đạt' ? 'green' : 'red'}>{item.evaluation}</Tag>
                                                    </Col>
                                                </Row>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24} className={styles.SubmitContainer}>
                                    <Button type="primary" onClick={handleSubmit}>Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>

            <Footer />
        </Fragment>
    );
}

export default MqttClient;
