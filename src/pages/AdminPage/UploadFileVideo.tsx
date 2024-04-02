import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Menu, Button } from 'antd';
import VideoBaiGrammar from './VideoBaiGrammar';
import VideoBaiCamBien from './VideoBaiNode';
import VideoBaiDieuKhien from './VideoBaiGateway';
import VideoBaiNgoaiVi from './VideoBaiCloud';

const UploadFileVideo: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>(null);
    const BaiGrammar = () => <div><VideoBaiGrammar /></div>;
    const BaiCamBien = () => <div><VideoBaiCamBien /></div>;
    const BaiDieuKhien = () => <div><VideoBaiDieuKhien /></div>
    const BaiNgoaiVi = () => <div><VideoBaiNgoaiVi /></div>

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '1':
                setSelectedComponent(<BaiGrammar />);
                break;
            case '2':
                setSelectedComponent(<BaiCamBien />);
                break;
            case '3':
                setSelectedComponent(<BaiDieuKhien />);
                break;
            case '4':
                setSelectedComponent(<BaiNgoaiVi />);
                break;
        }
    };

    // Define the menu items
    const items: MenuProps['items'] = [
        // {
        //     label: 'Khối nguồn',
        //     key: '1',
        // },
        {
            label: 'Lớp thiết bị',
            key: '2',
        },
        {
            label: 'Lớp mạng',
            key: '3',
        },
        {
            label: 'Lớp ứng dụng',
            key: '4'
        }
    ];

    return (
        <div>
            <Dropdown className='mb-5' overlay={<Menu items={items} onClick={handleMenuClick} />}>
                <Button onClick={(e) => e.preventDefault()}>
                    <Space>
                        Chọn bài học
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
            <div>
                {selectedComponent}
            </div>
        </div>
    );
};

export default UploadFileVideo;




