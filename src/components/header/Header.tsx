import React, { useState } from "react";
import { Avatar, Space, Typography, Spin, Badge, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Profile from "../../pages/Profile";
import { motion } from "framer-motion";
import { MessageDropdown } from "./MessageDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAvatar } from "../../hooks/useAvatar";
import { useUsers } from "../../hooks/useUsers";
import { useNotification } from "../../hooks/useNotification";
import logo from '../../assets/login/logo-ptit.png'

const CustomHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me } = useUsers();
  const { imageUrl, isLoading: isAvatarLoading } = useAvatar(me?.avatarUrl);

  const { notifications, isLoading: isNotificationLoading } = useNotification(me?.id || 0);
  const unreadNotifications = notifications.filter(n => !n.read);

  const onSearch = (value: string) => {
    console.log("Search query:", value);
    // Bạn có thể xử lý tìm kiếm ở đây
  };

  return (
    <Space
      direction="horizontal"
      align="center"
      className="w-full justify-between px-4 sm:px-6 lg:px-8 py-2 sm:py-3"
    >
      {/* Logo section */}
      <div className="flex items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14">
          <Image 
            src={logo} 
            alt="Logo" 
            preview={false}
            className="w-full h-full object-contain" 
          />
        </div>
      </div>

      {/* Title section */}
      <div className="flex-1 mx-4">
        <Typography.Title
          level={3}
          className="!m-0 text-center"
          style={{
            fontSize: 'clamp(16px, 1.8vw, 24px)',
            fontWeight: 600,
            color: '#2c4a2d'
          }}
        > 
          <div className="text-lg sm:text-xl lg:text-2xl mb-0">Open-Day</div>
          <div className="text-xs sm:text-sm lg:text-base opacity-85 hidden sm:block">
            Thực hành lập trình nhúng IoT OpenKIT-B
          </div>
        </Typography.Title>
      </div>

      {/* Controls section */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <div className="hidden sm:block">
          <MessageDropdown />
        </div>
        <div className="hidden sm:block">
          <Badge
            count={unreadNotifications.length}
            size="small"
            className="cursor-pointer"
          >
            <NotificationDropdown
              notifications={notifications}
              isLoading={isNotificationLoading}
            />
          </Badge>
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Avatar
            size={{ xs: 32, sm: 36, lg: 40 }}
            icon={
              isAvatarLoading ? (
                <Spin size="small" />
              ) : (
                <UserOutlined className="text-lg sm:text-xl" />
              )
            }
            src={!isAvatarLoading ? imageUrl : undefined}
            className="cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
            onClick={() => setIsModalOpen(true)}
          />
        </motion.div>
      </div>

      <Profile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Space>
  );
};

export default CustomHeader;
