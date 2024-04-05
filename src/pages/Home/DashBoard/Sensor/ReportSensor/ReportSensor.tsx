import React, { Fragment, useState, useEffect } from 'react';
import Header from '../../../../../components/Header/Header';
import Footer from '../../../../../components/Footer/Footer';
import style from '../Sensor.module.scss';
import * as Icon from '@mui/icons-material';
import 'firebase/database';
import app from '../../../../../util/firebase';
import { getDatabase, ref, onValue } from "firebase/database"
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';
import dayjs from 'dayjs';
import { Form, Input, Button, Table, Col, DatePicker, Row, Select } from 'antd';

const Report = () => {
    const location = useLocation();
    const [valueUrl, setValue] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const valueFromUrl = searchParams.get('value');
        if (valueFromUrl !== null) {
            setValue(valueFromUrl);
        }
    }, [location]);

    const [temperatureLevel, setTemperatureLevel] = useState(null);
    const [humidityLevel, setHumidityLevel] = useState(null);
    const [gasLevel, setGasLevel] = useState(null);
    const [lightLevel, setLightLevel] = useState(null);

    useEffect(() => {
        const db = getDatabase(app);
        const dbTemperatureRef = ref(db, `Sensor/temperature/${valueUrl}`);
        const dbHumidityRef = ref(db, `Sensor/humidity/${valueUrl}`);
        const dbGasRef = ref(db, `Sensor/gas/${valueUrl}`);
        const dbLightRef = ref(db, `Sensor/light/${valueUrl}`);

        // Lắng nghe sự thay đổi của dữ liệu từ Firebase Realtime Database
        const unsubscribeTemperature = onValue(dbTemperatureRef, (snapshot) => {
            if (snapshot.exists()) {
                const temperatureLevel = snapshot.val();
                setTemperatureLevel(temperatureLevel);
            } else {
                setTemperatureLevel(null);
            }
        });

        const unsubscribeHumidity = onValue(dbHumidityRef, (snapshot) => {
            if (snapshot.exists()) {
                const humidityLevel = snapshot.val();
                setHumidityLevel(humidityLevel);
            } else {
                setHumidityLevel(null);
            }
        });

        const unsubscribeGas = onValue(dbGasRef, (snapshot) => {
            if (snapshot.exists()) {
                const gasLevel = snapshot.val();
                setGasLevel(gasLevel);
            } else {
                setGasLevel(null);
            }
        });

        const unsubscribeLight = onValue(dbLightRef, (snapshot) => {
            if (snapshot.exists()) {
                const lightLevel = snapshot.val();
                setLightLevel(lightLevel);
            } else {
                setLightLevel(null);
            }
        });

        return () => {
            unsubscribeTemperature();
            unsubscribeHumidity();
            unsubscribeGas();
            unsubscribeLight();
        };
    }, [valueUrl]);

    const ChartBlock: React.FC<{ title: string, dataKey: string, data: any, color: string }> = ({ title, dataKey, data, color }) => (
        <div className={style.Chart}>
            <h3>{title}</h3>
            <ResponsiveContainer width="90%" height={300}>
                <BarChart data={[{ name: title, [dataKey]: data }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit={dataKey === 'temperature' ? ' °C' : dataKey === 'humidity' ? ' %' : dataKey === 'gas' ? ' ppm' : dataKey === 'light' ? ' lux' : ''} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={dataKey} fill={color} barSize={100} />
                    <ReferenceLine y={data} label={<Label value={`Value: ${data + (dataKey === 'temperature' ? ' °C' : dataKey === 'humidity' ? ' %' : dataKey === 'gas' ? ' ppm' : dataKey === 'light' ? ' lux' : '')}`} position="top" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const SensorBlock: React.FC<{ title: string, topic: string, value: any, icon: any }> = ({ title, topic, value, icon }) => (
        <div className={style.Block}>
            {React.createElement(icon, { fontSize: 'large' })}
            <div className={style.Info}>
                <h4>{title}</h4>
                <p>Topic: {topic}</p>
                <p>Value: {value}</p>
            </div>
        </div>
    );
    const navigate = useNavigate();

    const handleSubmit = () => {
        const newPath = `/home/DashBoard/Sensor/Report`;

        // Chuyển hướng đến trang mới
        navigate(newPath);
    };

    const [rowCount, setRowCount] = useState(1);

    const addRow = () => {
        setRowCount(rowCount + 1);
    };

    return (
        <Fragment>
            <Header />
            <div>
                <h2>DashBoard</h2>
                <div className={style.Container}>
                    <div className={style.ReportContainer}>
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item name="title" label="Tên bài">
                                        <Input placeholder="Nhập tên bài" />
                                    </Form.Item>
                                </Col>
                                <Row gutter={[16, 16]}>
                                    {[...Array(rowCount)].map((_, index) => (
                                        <Fragment key={index}>
                                            <Col span={12}>
                                                <Form.Item name={`studentName${index}`} label="Họ và tên sinh viên">
                                                    <Input placeholder="Nhập họ và tên sinh viên" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name={`studentId${index}`} label="Mã sinh viên">
                                                    <Input placeholder="Nhập mã sinh viên" />
                                                </Form.Item>
                                            </Col>
                                        </Fragment>
                                    ))}
                                    <Col span={12}>
                                        <Button type="dashed" onClick={addRow} block>
                                            Thêm sinh viên
                                        </Button>
                                    </Col>
                                </Row>
                                <Col span={8}>
                                    <Form.Item name="group" label="Nhóm">
                                        <Input placeholder="Nhập nhóm" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="class" label="Lớp">
                                        <Input placeholder="Nhập lớp" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="date" label="Ngày thực hành">
                                        <DatePicker format="DD/MM/YYYY" defaultValue={dayjs()} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="instructor" label="Giảng viên hướng dẫn">
                                        <Input placeholder="Nhập tên giảng viên hướng dẫn" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="practiceSession" label="Ca thực tập">
                                        <Input placeholder="Nhập ca thực tập" />
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                    <div className={style.MainContainer}>
                        <h3>Nhóm số {valueUrl}</h3>
                        <div className={style.SensorGrid}>
                            <SensorBlock title={`Nhiệt độ`} topic={`Sensor/temperature/${valueUrl}`} value={`${temperatureLevel} °C`} icon={Icon.ThermostatOutlined} />
                            <SensorBlock title={`Độ ẩm`} topic={`Sensor/humidity/${valueUrl}`} value={`${humidityLevel} %`} icon={Icon.OpacityOutlined} />
                            <SensorBlock title={`Khí gas`} topic={`Sensor/gas/${valueUrl}`} value={`${gasLevel} ppm`} icon={Icon.AirOutlined} />
                            <SensorBlock title={`Ánh sáng`} topic={`Sensor/light/${valueUrl}`} value={`${lightLevel} lux`} icon={Icon.LightModeOutlined} />
                        </div>
                    </div>
                    <div className={style.ChartContainer}>
                        <h3>Biểu đồ</h3>
                        <div className={style.ChartGrid}>
                            <ChartBlock title={`Nhiệt độ`} dataKey="temperature" data={temperatureLevel} color="#82ca9d" />
                            <ChartBlock title={`Độ ẩm`} dataKey="humidity" data={humidityLevel} color="#8884d8" />
                            <ChartBlock title={`Khí gas`} dataKey="gas" data={gasLevel} color="#ffc658" />
                            <ChartBlock title={`Ánh sáng`} dataKey="light" data={lightLevel} color="#ff7300" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}

export default Report;
