import React, { useState } from 'react';
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined, WifiOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import IoT from './IoT';
import SubMenu from 'antd/es/menu/SubMenu';
import NodeBlockAdmin from './NodeBlockAdmin';
import GatewayBlockAdmin from './GatewayBlockAdmin';
import CloudBlockAdmin from './CloudBlockAdmin';
import VideoBaiGrammar from './VideoBaiGrammar';
import UploadFileVideo from './UploadFileVideo';
// import styles from './Header.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { NavLink } from 'react-router-dom';
import { logout } from '../../redux/UserReducer/UserReducer';
import UserManage from './UserManage';


const { Header, Content, Footer, Sider } = Layout;

const AdminPage: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedContent, setSelectedContent] = useState('');
    const dispatch: DispatchType = useDispatch();
    const handleMenuClick = (item: any) => {
        switch (item.key) {
            case "KhoiNguon":
                setSelectedContent("IoT");
                break;
            case "KhoiThietBi":
                setSelectedContent("NodeBlock");
                break;
            case "KhoiMang":
                setSelectedContent("GatewayBlock");
                break;
            case "KhoiUngDung":
                setSelectedContent("CloudBlock");
                break;
            case "UploadVideo":
                setSelectedContent("UploadVideo");
                break;
            default:
                setSelectedContent(item.key);
                break;
        }
    }


    const contentMap: { [key: string]: React.ReactNode } = {
        IoT: <IoT />,
        NodeBlock: <NodeBlockAdmin />,
        GatewayBlock: <GatewayBlockAdmin />,
        CloudBlock: <CloudBlockAdmin />,
     
        UploadVideo: <UploadFileVideo />,
        ManageUser: <UserManage />
    }

    const email = useSelector((state: RootState) => state.UserReducer.email);
    const handLogout = () => {
        dispatch(logout());
    }
    const menu = (
        <Menu>
            <Menu.Item key="home">
                <NavLink to="/home" className="text-decoration-none" >Trang Home</NavLink>
            </Menu.Item>
            <Menu.Item key="chat">
                <NavLink to="/boxchat" className="text-decoration-none">Trợ giảng lab</NavLink>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handLogout}>
                <span className="text-decoration-none">Đăng xuất</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Sider
                trigger={null} collapsible collapsed={collapsed}
                breakpoint="lg"
                // collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={handleMenuClick}>
                    <SubMenu key="IoT" icon={<UserOutlined />} title="IoT" >

                        <Menu.Item key="KhoiThietBi">Lớp thiết bị</Menu.Item>
                        <Menu.Item key="KhoiMang">Lớp mạng</Menu.Item>
                        <Menu.Item key="KhoiUngDung">Lớp ứng dụng</Menu.Item>
                    </SubMenu>
                    
                    <Menu.Item key="UploadVideo" icon={<UploadOutlined />}>
                        Upload Video
                    </Menu.Item>
                    <Menu.Item key="ManageUser" icon={<UserOutlined />}>
                        Quản lý sinh viên
                    </Menu.Item>
                </Menu>


            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                            <Space>
                                {email}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>

                </Header>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, height: '100vh', background: colorBgContainer }}>
                        {contentMap[selectedContent]}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPage;