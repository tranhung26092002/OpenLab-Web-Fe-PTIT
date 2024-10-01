import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DispatchType, RootState } from '../../../redux/configStore';
import { getAllReports, updateGrade, deleteReport } from '../../../redux/ReportReducer/ReportReducer';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import styles from './Report.module.scss';
import dayjs from 'dayjs';
import { Form, Col, Row, List, Tag, Modal, message, Button, Input, DatePicker, notification, Select, UploadFile, Upload } from 'antd';
import { submitData } from '../../../redux/ReportReducer/ReportReducer';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const initialPage = 1;
const initialPerPage = 10;

const Report = () => {
    const dispatch = useDispatch<DispatchType>();
    const reports = useSelector((state: RootState) => state.ReportReducer.items);
    const role = useSelector((state: RootState) => state.UserReducer.role);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grade, setGrade] = useState('');

    useEffect(() => {
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
        if (!grade) {
            message.error('Bạn chưa nhập điểm số');
            return;
        }

        dispatch(updateGrade({ reportId, grade }))
            .then(() => {
                message.success('Cập nhật điểm thành công!');
                dispatch(getAllReports());
            }).catch(() => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update sensor data'
                });
            });
    };

    const handleDeleteReport = async (reportId: number) => {
        if (role !== 'ROLE_ADMIN') {
            message.error('Bạn không có quyền xóa báo cáo.');
            return;
        }

        dispatch(deleteReport(reportId))
            .then(() => {
                message.success('Xóa báo cáo thành công!');
                dispatch(getAllReports());
            }).catch(() => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update sensor data'
                });
            });
    };

    // Sử dụng useState để khởi tạo và cập nhật giá trị của currentPage và studentsPerPage
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [studentsPerPage] = useState(initialPerPage);

    const renderStudentInfo = (reports: any, currentPage: any, studentsPerPage: any) => {
        if (!Array.isArray(reports)) {
            return <div>No reports data available</div>;
        }
        const reverseReports = [...reports].reverse();

        // Tính chỉ số bắt đầu và chỉ số kết thúc của danh sách sinh viên cho trang hiện tại
        const startIndex = (currentPage - 1) * studentsPerPage;
        const endIndex = startIndex + studentsPerPage;
        const currentStudents = reverseReports.slice(startIndex, endIndex);

        return (
            <Fragment>
                <h2>Thông tin sinh viên</h2>
                {/* Render student information here */}
                {currentStudents.map((report, index) => (
                    <div className={styles.StudentInfo} key={index} onClick={() => handleStudentClick(report)}>
                        <p>Họ và tên: {report.student.name}</p>
                        <p>Mã sinh viên: {report.student.studentId}</p>
                        <p>Thời gian nộp bài: {dayjs(report.date).format('DD/MM/YYYY')}</p>
                    </div>
                ))}

                {/* Render pagination */}
                <div className={styles.Pagination}>
                    {Array.from({ length: Math.ceil(reports.length / studentsPerPage) }, (_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </Fragment>
        );
    };

    // Sử dụng hàm renderStudentInfo với reports và số trang và số lượng sinh viên mỗi trang được chỉ định
    const studentInfoComponent = renderStudentInfo(reports, currentPage, studentsPerPage);


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

    // report
    const [form] = Form.useForm(); // Use the useForm hook to get the form instance

    const handleSubmit = () => {
        // Lấy dữ liệu từ form
        const formData = form.getFieldsValue();
        const { title, group, nameClass, instructor, practiceSession } = formData;
        const formattedDate = formData.date ? dayjs(formData.date).format('YYYY-MM-DD') : ''; // Định dạng lại ngày tháng

        const studentName = formData[`studentName`];
        const studentId = formData[`studentId`];

        const imageFile = form.getFieldValue('image') && form.getFieldValue('image')[0] && form.getFieldValue('image')[0].originFileObj;

        if (!title || !group || !nameClass || !instructor || !practiceSession || !studentName || !studentId) {
            message.error('Chưa nhập đầy đủ thông tin!');
            return;
        }
        // Tiếp tục xử lý khi không có giá trị null
        const reportData = {
            title: title,
            group: group,
            nameClass: nameClass,
            date: formattedDate,
            instructor: instructor,
            practiceSession: practiceSession,
            student: { name: studentName, id: studentId }, // Thêm thông tin về sinh viên vào đối tượng reportData
            image: imageFile,
        };

        dispatch(submitData(reportData))
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: 'Created Successfully'
                });
                dispatch(getAllReports());
            }).catch(() => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update sensor data'
                });
            });
    };

    return (
        <Fragment>
            <Header />
            <div>
                <h2>Báo cáo thực hành</h2>
                <div className={styles.Container}>
                    <div className={styles.ReportContainer}>
                        <div className={styles.FormContainer}>
                            <Form layout="vertical" form={form}>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <h2 className={styles.ReportTitle}>Report</h2>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]}>
                                    <Col span={10}>
                                        <Form.Item name="title" label="Chọn đề tài cho bài thu hoạch cuối khóa">
                                            <Select placeholder="Chọn đề tài">
                                                <Option value="Đề tài 1: Hệ thống chiếu sáng thông minh">Đề tài 1: Hệ thống chiếu sáng thông minh</Option>
                                                <Option value="Đề tài 2: Hệ thống cảnh báo khí Gas thông minh">Đề tài 2: Hệ thống cảnh báo khí Gas thông minh</Option>
                                                <Option value="Đề tài 3: Hệ thống làm mát thông minh">Đề tài 3: Hệ thống làm mát thông minh</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="date" label="Ngày thực hành">
                                            <DatePicker format="DD/MM/YYYY" defaultValue={dayjs()} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            label="Image"
                                            name="image"
                                            rules={[{ required: true, message: 'Please upload an image!' }]}
                                            valuePropName="fileList"
                                            getValueFromEvent={normFile}
                                        >
                                            <Upload
                                                name="image"
                                                listType="picture"
                                                maxCount={1}
                                                beforeUpload={(file: UploadFile) => {
                                                    // mô phỏng việc upload, không thực sự gửi file lên server
                                                    console.log("File được chọn:", file);
                                                    return false; // Trả về false để ngăn chặn việc gửi yêu cầu HTTP
                                                }}
                                            >
                                                <>
                                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                                </>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]}>
                                    <Fragment>
                                        <Col span={6}>
                                            <Form.Item name="studentName" label="Họ và tên sinh viên">
                                                <Input placeholder="Nhập họ và tên sinh viên" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="studentId" label="Mã sinh viên">
                                                <Input placeholder="Nhập mã sinh viên" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name="nameClass" label="Lớp">
                                                <Input placeholder="Nhập lớp" />
                                            </Form.Item>
                                        </Col>
                                    </Fragment>
                                </Row>
                                <Row gutter={[16, 16]}>
                                    <Col span={6}>
                                        <Form.Item name="instructor" label="Giảng viên hướng dẫn">
                                            <Input placeholder="Nhập tên giảng viên hướng dẫn" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name="practiceSession" label="Ca thực tập">
                                            <Input placeholder="Nhập ca thực tập" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name="group" label="Nhóm">
                                            <Input placeholder="Nhập nhóm" />
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
                    <div className={styles.ShowReportContainer}>
                        {renderReport()}
                    </div>
                    <div className={styles.StudentInfoContainer}>
                        {studentInfoComponent}
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

function normFile(e: any) {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
}

export default Report;