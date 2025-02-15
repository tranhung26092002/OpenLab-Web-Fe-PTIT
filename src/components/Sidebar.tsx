import React from "react";
import { Menu, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from '../hooks/useAuth';
import logo from '../assets/login/logo-ptit.png'
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  DashboardOutlined,
  CarryOutOutlined,
  SettingOutlined,
  HomeOutlined,
  ContactsOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;  // onClick là tùy chọn
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { isAuthenticated, signOut } = false;
  const isAuthenticated = true; // Replace with actual authentication logic
  const signOut = async () => {
    // Replace with actual sign out logic
    console.log('Signed out');
  };

  const handleMenuClick = (path: string) => {
    NProgress.start();
    setTimeout(() => {
      navigate(path);
      NProgress.done();
    }, 300);
  };

  const handleLogout = async () => {
    NProgress.start(); // Bắt đầu thanh tiến trình

    try {
      await signOut(); // Thực hiện đăng xuất
      NProgress.done(); // Dừng thanh tiến trình khi đăng xuất thành công
      // window.location.href = '/login';
    } catch (error) {
      NProgress.done(); // Dừng thanh tiến trình khi có lỗi
      console.error('Logout failed:', error);
    }
  };

  const getBaseMenuItems = (): MenuItem[] => [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "/about",
      icon: <UserOutlined />,
      label: "About",
      path: "/about",
    },
    {
      key: "/contact",
      icon: <ContactsOutlined />,
      label: "Contact",
      path: "/contact",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: "Setting",
      path: "/setting",
    },
    {
      key: "/login",
      icon: <LoginOutlined />,
      label: "Login",
      path: "/login",
    }
  ];

  const menuItems: MenuItem[] = [
    ...getBaseMenuItems(),
  ];

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="logo w-16 h-16">
          <Image src={logo} alt="Logo" />
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="menu-bar"
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: item.onClick,
        }))}
        onClick={({ key }) => {
          const item = menuItems.find(item => item.key === key);
          if (item?.path) {
            handleMenuClick(item.path);
          } else if (item?.onClick) {
            item.onClick();  // Gọi onClick nếu tồn tại
          }
        }}
      />
    </>
  );
};

export default Sidebar;