import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, notification } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import { User, addUser, deleteUser, editUser, getAllUsers } from '../../redux/UserReducer/UserReducer';
import { DispatchType, RootState } from '../../redux/configStore';
import { useDispatch, useSelector } from 'react-redux';
import { Option } from 'antd/es/mentions';

type Props = {}

const UserManage = () => {
    const dispatch: DispatchType = useDispatch();
    const users = useSelector((state: RootState) => state.UserReducer.users);
    const loading = useSelector((state: RootState) => state.UserReducer.loading);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleDelete = (userId: number) => {
        const userExists = users.some(user => user.id === userId);
        if (!userExists) {
            notification.error({
                message: 'Error',
                description: 'User not found',
            });
            return;
        }
        dispatch(deleteUser(userId))
            .then(() => {
                notification.success({
                    message: 'User Deleted',
                    description: 'The user has been deleted successfully',
                });
                dispatch(getAllUsers());
            })
            .catch((error) => {

                notification.error({
                    message: 'Error',
                    description: error.message || 'Failed to delete user',
                });
            });
    };



    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(null);

    const showEditModal = (user: User) => {
        setCurrentEditingUser(user);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            email: user.email,
            password: '',
            vaiTro: user.vaiTro.toString(),
        });
    };

    const handleEditOk = () => {
        form
            .validateFields()
            .then((values) => {
                if (!currentEditingUser) {
                    console.error('No user selected for editing');
                    return;
                }

                const updatedUserData = {
                    ...values,
                    id: currentEditingUser.id,
                    vaiTro: parseInt(values.vaiTro),
                };

                console.log("Updating user:", updatedUserData);
                dispatch(editUser({ userId: currentEditingUser.id, userData: updatedUserData }))
                    .unwrap()
                    .then(() => {
                        notification.success({
                            message: 'User Updated',
                            description: 'The user has been updated successfully',
                        });
                        setIsEditModalVisible(false);
                        setCurrentEditingUser(null);
                        dispatch(getAllUsers());
                    })
                    .catch((error) => {
                        notification.error({
                            message: 'Error',
                            description: error.message || 'Failed to update user',
                        });
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };


    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setCurrentEditingUser(null);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log("add user", values)
                dispatch(addUser(values))
                    .unwrap()
                    .then(() => {
                        notification.success({
                            message: 'User Added',
                            description: 'The user has been added successfully',
                        });
                        dispatch(getAllUsers());
                    })
                    .catch((error) => {
                        notification.error({
                            message: 'Error',
                            description: error.message || 'Failed to add user',
                        });
                    });

                form.resetFields();
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: 'Vai trò',
            dataIndex: 'vaiTro',
            key: 'vaiTro',
            render: (vaiTro: any) => (vaiTro === 1 ? 'ROLE_USER' : 'ROLE_ADMIN'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: number, record: User) => (
                <Space size="middle">
                    <Button onClick={() => showEditModal(record)}>Update</Button>
                    <Popconfirm
                        title="Are you sure delete this user ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Fragment>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Thêm sinh viên
            </Button>
            <Table dataSource={users} columns={columns} rowKey="id" />
            <Modal title="Add User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" name="userForm">
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="vaiTro" label="Vai Trò" rules={[{ required: true, message: 'Please select a role!' }]}>
                        <Select placeholder="Select a role">
                            <Option value="1">ROLE_USER</Option>
                            <Option value="2">ROLE_ADMIN</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Edit User" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <Form form={form} layout="vertical" name="userEditForm">
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="vaiTro" label="Vai Trò" rules={[{ required: true }]}>
                        <Select>
                            <Option value="1">ROLE_USER</Option>
                            <Option value="2">ROLE_ADMIN</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    );
};

export default UserManage;