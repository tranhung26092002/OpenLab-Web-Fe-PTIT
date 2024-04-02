import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, Upload, UploadFile, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { createBaiIoT, deleteBaiIoT, fetchAllBaiIoT, fetchBaiIoTPaginated, updateBaiIoT } from '../../redux/BaiIoT/BaiIoTReducer';
import { UploadOutlined } from '@ant-design/icons';



const IoT: React.FC = () => {
    const dispatch = useDispatch<DispatchType>();
    const baiGrammarData = useSelector((state: RootState) => Array.isArray(state.BaiIoTReducer.items) ? state.BaiIoTReducer.items : []);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<number | null>(null);

    const baiIoTStatus = useSelector((state: RootState) => state.BaiIoTReducer.status);
    const baiIoTError = useSelector((state: RootState) => state.BaiIoTReducer.error);

    // const [currentPage, setCurrentPage] = useState(1);
    // const pageSize = 10;

    useEffect(() => {
        if (baiIoTStatus === 'succeeded') {
            notification.success({
                message: 'Success',
                description: 'Operation completed successfully!'
            });
        } else if (baiIoTStatus === 'failed' && baiIoTError) {
            notification.error({
                message: 'Error',
                description: baiIoTError
            });
        }
    }, [baiIoTStatus, baiIoTError]);

    // useEffect(() => {
    //     dispatch(fetchBaiIoTPaginated({ page: currentPage, size: pageSize }));
    // }, [dispatch, currentPage]);

    useEffect(() => {
        dispatch(fetchAllBaiIoT());
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
                tenBaiGrammar: values.tenBaiGrammar,
                contentHTML: contentHTMLFile
            };
            console.log("Prepared data:", data);

            if (editingId) {
                dispatch(updateBaiIoT({ id: String(editingId), data }))
                    .then(() => {
                        notification.success({
                            message: 'Success',
                            description: 'Updated Sucessfully'
                        });
                    }).catch(() => {
                        notification.error({
                            message: 'Error',
                            description: 'Error Failed Update Exercise'
                        })
                    })
            } else {
                dispatch(createBaiIoT(data))
                    .then(() => {
                        notification.success({
                            message: 'Success',
                            description: 'Created Sucessfully'
                        });
                    }).catch(() => {
                        notification.error({
                            message: 'Error',
                            description: 'Error Failed Create Exercise'
                        })
                    })
            }
            setIsModalVisible(false);
            form.resetFields();

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
        dispatch(deleteBaiIoT(id))
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
                dataSource={baiGrammarData.map(item => ({ ...item, key: item.baiGrammarId }))}
                columns={[
                    { title: 'ID', dataIndex: 'baiGrammarId', key: 'baiGrammarId' },
                    {
                        title: 'Ảnh tiêu đề', dataIndex: 'anhBaiGrammar', key: 'anhBaiGrammar',
                        render: (imgageUrl: string) => (
                            <img src={imgageUrl} alt="Anh tieu de" style={{ width: '80px', height: '80px' }} />
                        )
                    },
                    { title: 'Name', dataIndex: 'tenBaiGrammar', key: 'tenBaiGrammar' },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                            <>
                                <Button
                                    type="primary"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => {
                                        setEditingId(record.baiGrammarId); // Đặt ID đang chỉnh sửa
                                        form.setFieldsValue({
                                            tenBaiGrammar: record.tenBaiGrammar
                                        });
                                        setIsModalVisible(true);
                                    }}>Update</Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this entry?"
                                    onConfirm={() => handleDelete(String(record.baiGrammarId))}
                                    onCancel={() => console.log('Cancelled delete for:', record.baiGrammarId)}
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
                        name="tenBaiGrammar"
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

export default IoT;
