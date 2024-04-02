import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, Upload, UploadFile, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { UploadOutlined } from '@ant-design/icons';
import { createBaiKhoiNgoaiVi, deleteBaiKhoiNgoaiVi, fetchAllBaiKhoiNgoaiVi, updateBaiNgoaiVi } from '../../redux/CloudBlockReducer/CloudBlockReducer';

const PeripheralBlockAdmin: React.FC = () => {
    const dispatch = useDispatch<DispatchType>();
    const baiNgoaiViData = useSelector((state: RootState) => Array.isArray(state.PeripheralBlockReducer.items) ? state.PeripheralBlockReducer.items : []);
    console.log("baiNgoaiViData", baiNgoaiViData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<number | null>(null);

    const baiKhoiNgoaiViStatus = useSelector((state: RootState) => state.PeripheralBlockReducer.status);
    const baiKhoiNgoaiViError = useSelector((state: RootState) => state.PeripheralBlockReducer.error);

    // const [currentPage, setCurrentPage] = useState(1);
    // const pageSize = 10;

    useEffect(() => {
        if (baiKhoiNgoaiViStatus === 'succeeded') {
            notification.success({
                message: 'Success',
                description: 'Operation completed successfully!'
            });
        } else if (baiKhoiNgoaiViStatus === 'failed' && baiKhoiNgoaiViError) {
            notification.error({
                message: 'Error',
                description: baiKhoiNgoaiViError
            });
        }
    }, [baiKhoiNgoaiViStatus, baiKhoiNgoaiViError]);

    // useEffect(() => {
    //     dispatch(fetchBaiIoTPaginated({ page: currentPage, size: pageSize }));
    // }, [dispatch, currentPage]);

    useEffect(() => {
        dispatch(fetchAllBaiKhoiNgoaiVi());
    }, [dispatch]);


    // const handleChangePage = (page: number) => {
    //     setCurrentPage(page);
    // };

    const handleAddOrEdit = (values: any) => {
        console.log('Received values:', values);

        const imageFile = values.image && values.image[0] && values.image[0].originFileObj;
        const contentHTMLFile = values.contentHTML && values.contentHTML[0] && values.contentHTML[0].originFileObj;



        if (imageFile && contentHTMLFile) {
            const data = {
                image: imageFile,
                tenKhoiNgoaiVi: values.tenKhoiNgoaiVi,
                contentHTML: contentHTMLFile
            };
            console.log("Prepared data:", data);

            if (editingId) {
                dispatch(updateBaiNgoaiVi({ id: String(editingId), data }));
            } else {
                dispatch(createBaiKhoiNgoaiVi(data));
            }
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Success',
                description: 'Created Sucessfully'
            });
        } else {
            if (!imageFile) {
                console.log("Image file is missing or not structured correctly");
            }
            if (!contentHTMLFile) {
                console.log("contentHTML file is missing or not structured correctly");
            }
            notification.error({
                message: 'Error',
                description: 'Please ensure both files are uploaded'
            });
        }
    };

    const handleDelete = (id: string) => {
        dispatch(deleteBaiKhoiNgoaiVi(id))
            .then(() => {
                notification.success({
                    message: 'Deleted',
                    description: 'Deleted successfully!',
                });
            })
            .catch(() => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete!',
                });
            });
    };
    return (
        <div>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>Add New</Button>
            <Table
                dataSource={baiNgoaiViData.map(item => ({ ...item, key: item.ngoaiViId }))}
                columns={[
                    { title: 'ID', dataIndex: 'ngoaiViId', key: 'ngoaiViId' },
                    {
                        title: 'Ảnh tiêu đề', dataIndex: 'anhNgoaiVi', key: 'anhNgoaiVi',
                        render: (imageUrl: string) => (
                            <img src={imageUrl} alt="Anh tieu de" style={{ width: '80px', height: '80px' }} />
                        )
                    },
                    { title: 'Name', dataIndex: 'tenNgoaiVi', key: 'tenNgoaiVi' },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                            <>
                                <Button
                                    type="primary"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => {
                                        setEditingId(record.ngoaiViId);
                                        form.setFieldsValue({
                                            tenKhoiNgoaiVi: record.tenNgoaiVi
                                        });
                                        setIsModalVisible(true);
                                    }}>Update</Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this entry?"
                                    onConfirm={() => handleDelete(String(record.ngoaiViId))}
                                    onCancel={() => console.log('Cancelled delete for:', record.ngoaiViId)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger>Delete</Button>
                                </Popconfirm>

                            </>
                        ),
                    },
                ]}
            />
            <Modal
                title={editingId ? "Edit" : "Add New"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrEdit}
                >
                    <Form.Item
                        label="Tên bài thực hành"
                        name="tenKhoiNgoaiVi"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>

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

                    <Form.Item
                        label="Nội dung cần upload"
                        name="contentHTML"
                        rules={[{ required: true, message: 'Please upload a document!' }]}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            name="doc"
                            accept=".doc,.docx"
                            maxCount={1}
                            beforeUpload={(file: UploadFile) => {
                                // mô phỏng việc upload, không thực sự gửi file lên server
                                console.log("File được chọn:", file);
                                return false; // Trả về false để ngăn chặn việc gửi yêu cầu HTTP
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}

function normFile(e: any) {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
}

export default PeripheralBlockAdmin;