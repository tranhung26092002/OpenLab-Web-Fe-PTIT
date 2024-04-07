import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DispatchType, RootState } from '../../../../../redux/configStore';
import { getAllSensorReports } from '../../../../../redux/SensorReducer/SensorReducer';
import Header from '../../../../../components/Header/Header';
import Footer from '../../../../../components/Footer/Footer';
import style from '../Sensor.module.scss';
import * as Icon from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';
import dayjs from 'dayjs';
import { Form, Input, Col, DatePicker, Row } from 'antd';

const Report = () => {
    const dispatch = useDispatch<DispatchType>();
    const reports = useSelector((state: RootState) => state.sensorReport.items);
    useEffect(() => {
        // Gọi action để lấy dữ liệu từ backend và cập nhật vào Redux store
        dispatch(getAllSensorReports());
    }, [dispatch]);


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

    return (
        <Fragment>
            <Header />
            <div>
                <h2>Báo cáo thực hành</h2>
                <div className={style.Container}>
                    {reports.slice().reverse().map((report, index) => (
                        <div className={style.ReportContainer} key={index}>
                            <div className={style.MainContainer}>
                                <h3>Nhóm số {report.groupName}</h3>
                                <div className={style.SensorGrid}>
                                    <SensorBlock title={`Nhiệt độ`} topic={`Sensor/temperature/${report.groupName}`} value={`${report.temperature} °C`} icon={Icon.ThermostatOutlined} />
                                    <SensorBlock title={`Độ ẩm`} topic={`Sensor/humidity/${report.groupName}`} value={`${report.humidity} %`} icon={Icon.OpacityOutlined} />
                                    <SensorBlock title={`Khí gas`} topic={`Sensor/gas/${report.groupName}`} value={`${report.gas} ppm`} icon={Icon.AirOutlined} />
                                    <SensorBlock title={`Ánh sáng`} topic={`Sensor/light/${report.groupName}`} value={`${report.light} lux`} icon={Icon.LightModeOutlined} />
                                </div>
                            </div>
                            <div className={style.ReportContainer}>
                                <Form layout="vertical">
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Form.Item name="title" label="Tên bài">
                                                <Input defaultValue={report.title} readOnly />
                                            </Form.Item>
                                        </Col>
                                        {report.students && report.students.length > 0 && (
                                            <Fragment>
                                                <Row gutter={[16, 16]}>
                                                    {report.students.map((student: any, studentIndex: number) => (
                                                        <Fragment key={studentIndex}>
                                                            <Col span={12}>
                                                                <Form.Item name={`studentName${studentIndex}`} label="Họ và tên sinh viên">
                                                                    <Input defaultValue={student.name} readOnly />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item name={`studentId${studentIndex}`} label="Mã sinh viên">
                                                                    <Input defaultValue={student.id} readOnly />
                                                                </Form.Item>
                                                            </Col>
                                                        </Fragment>
                                                    ))}
                                                </Row>
                                            </Fragment>
                                        )}
                                        <Col span={8}>
                                            <Form.Item name="group" label="Nhóm">
                                                <Input defaultValue={report.groupName} readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="class" label="Lớp">
                                                <Input defaultValue={report.className} readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="date" label="Ngày thực hành">
                                                <DatePicker format="DD/MM/YYYY" defaultValue={dayjs(report.date)} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="instructor" label="Giảng viên hướng dẫn">
                                                <Input defaultValue={report.instructor} readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="practiceSession" label="Ca thực tập">
                                                <Input defaultValue={report.practiceSession} readOnly />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>

                            <div className={style.ChartContainer}>
                                <h3>Biểu đồ</h3>
                                <div className={style.ChartGrid}>
                                    <ChartBlock title={`Nhiệt độ`} dataKey="temperature" data={report.temperature} color="#82ca9d" />
                                    <ChartBlock title={`Độ ẩm`} dataKey="humidity" data={report.humidity} color="#8884d8" />
                                    <ChartBlock title={`Khí gas`} dataKey="gas" data={report.gas} color="#ffc658" />
                                    <ChartBlock title={`Ánh sáng`} dataKey="light" data={report.light} color="#ff7300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Report;
