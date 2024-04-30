import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DispatchType, RootState } from '../../../redux/configStore';
import { getAllReports, updateGrade, deleteReport } from '../../../redux/ReportReducer/ReportReducer';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import styles from './Report.module.scss';
import dayjs from 'dayjs';
import { Form, Col, Row, List, Tag, Modal, message, Button, Input } from 'antd';

const Report = () => {
    const dispatch = useDispatch<DispatchType>();
    const reports = useSelector((state: RootState) => state.ReportReducer.items);
    const role = useSelector((state: RootState) => state.UserReducer.role);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grade, setGrade] = useState('');

    useEffect(() => {
        // Gọi action để lấy dữ liệu từ backend và cập nhật vào Redux store
        dispatch(getAllReports());
    }, [dispatch]);


    const exercises = [
        { name: 'Buổi 1', content: 'THỰC HÀNH LẬP TRÌNH CƠ BẢN CHO VI ĐIỀU KHIỂN (STM32/ARDUINO)', evaluation: 'Đạt' },
        { name: 'Buổi 2', content: 'THỰC HÀNH GIAO TIẾP CẢM BIẾN-VI ĐIỀU KHIỂN-RELAY-BÓNG ĐÈN-MOTOR', evaluation: 'Đạt' },
        { name: 'Buổi 3', content: 'THỰC HÀNH GIAO THỨC TRUYỀN NHẬN DỮ LIỆU SPI/I2C/UART', evaluation: 'Đạt' },
        { name: 'Buổi 4', content: 'THỰC HÀNH  MẠNG ZIGBEE', evaluation: 'Đạt' },
        { name: 'Buổi 5', content: 'THỰC HÀNH MẠNG LORA', evaluation: 'Đạt' },
        { name: 'Buổi 6', content: 'THỰC HÀNH CLOUD', evaluation: 'Đạt' },
        { name: 'Buổi 7', content: 'THỰC HÀNH ĐIỀU KHIỂN QUA SMART PHONE', evaluation: 'Đạt' },
    ];

    const handleStudentClick = (report: any) => {
        setSelectedStudent(report);
    };

    const handleUpdateGrade = (reportId: number, grade: number) => {
        if (role !== "ROLE_ADMIN") {
            message.error('Bạn không có quyền cập nhật điểm số');
            return;
        }

        dispatch(updateGrade({ reportId, grade }));
    };

    const handleDeleteReport = async (reportId: number) => {
        if (role !== 'ROLE_ADMIN') {
            message.error('Bạn không có quyền xóa báo cáo.');
            return;
        }

        dispatch(deleteReport(reportId))
    };

    const renderStudentInfo = () => {
        if (!Array.isArray(reports)) {
            return <div>No reports data available</div>;
        }

        return (
            <Fragment>
                <h2>Thông tin sinh viên</h2>
                {/* Render student information here */}
                {reports.map((report, index) => (
                    <div className={styles.StudentInfo} key={index} onClick={() => handleStudentClick(report)}>
                        <p>Họ và tên: {report.student.name}</p>
                        <p>Mã sinh viên: {report.student.studentId}</p>
                        <p>Thời gian nộp bài: {dayjs(report.date).format('DD/MM/YYYY')}</p>
                    </div>
                ))}
            </Fragment>
        );
    };

    const renderReport = () => {
        if (!selectedStudent) {
            return <div>Vui lòng chọn một sinh viên để hiển thị báo cáo.</div>;
        }

        // Find the report for the selected student
        const studentReport = reports.find(report => report === selectedStudent);

        if (!studentReport) {
            return <div>Không tìm thấy báo cáo cho sinh viên này.</div>;
        }

        return (
            <Modal
                title={`Báo cáo của sinh viên: ${studentReport.student.name}`}
                visible={true}
                onCancel={() => setSelectedStudent(null)}
                footer={null}
                width={800} // Adjust the width of the modal
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }} // Enable scrolling
            >
                <div>
                    {/* Render report for selected student here */}
                    <h2>Báo cáo của sinh viên: {studentReport.student.name}</h2>
                    <div className={styles.FormContainer}>
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col span={16}>
                                    <Form.Item name="title" label="Đề tài bài thu hoạch cuối khóa:">
                                        <p>{studentReport.title}</p>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="date" label="Ngày thực hành:">
                                        <p>{dayjs(studentReport.date).format('DD/MM/YYYY')}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Fragment>
                                    <Col span={8}>
                                        <Form.Item name="studentName" label="Họ và tên sinh viên:">
                                            <p>{studentReport.student.name}</p>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="studentId" label="Mã sinh viên:">
                                            <p>{studentReport.student.studentId}</p>
                                        </Form.Item>
                                    </Col>
                                </Fragment>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item name="group" label="Nhóm:">
                                        <p>{studentReport.groupName}</p>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="nameClass" label="Lớp:">
                                        <p>{studentReport.className}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item name="instructor" label="Giảng viên hướng dẫn:">
                                        <p>{studentReport.instructor}</p>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="practiceSession" label="Ca thực tập:">
                                        <p>{studentReport.practiceSession}</p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item name="grade" label="Điểm bài thu hoạch cuối khóa:">
                                        <Input placeholder="Nhập điểm" defaultValue={studentReport.grade} value={grade} onChange={(e) => setGrade(e.target.value)} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="update" label="Update">
                                        <Button type="primary" onClick={() => handleUpdateGrade(studentReport.reportId, parseInt(grade, 10))}>Cập nhật</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="delete" label="Xóa">
                                        <Button danger onClick={() => handleDeleteReport(studentReport.reportId)}>Xóa</Button>
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
                        </Form>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <Fragment>
            <Header />
            <div>
                <h2>Báo cáo thực hành</h2>
                <div className={styles.Container}>
                    <div className={styles.ReportContainer}>
                        {renderReport()}
                    </div>
                    <div className={styles.StudentInfoContainer}>
                        {renderStudentInfo()}
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Report;