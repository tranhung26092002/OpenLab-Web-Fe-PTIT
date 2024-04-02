import React, { useState } from 'react';
import { Modal } from 'antd';
import styles from '../../VideoModal.module.scss'
import { DOMAIN_VIDEO } from '../../../../../util/config';

interface Video {
    id: number;
    videoPath: string;
    title: string;
    description: string;
    uploadTime: string;
}

interface VideoModalProps {
    videos: Video[];
    isOpen: boolean;
    onClose: () => void;
}

const VideoCamBienModal: React.FC<VideoModalProps> = ({ videos, isOpen, onClose }) => {
    const [currentVideo, setCurrentVideo] = useState<string>(videos[0]?.videoPath || '');

    const handleVideoChange = (videoPath: string) => {
        setCurrentVideo(videoPath);
    };

    const formatDateAndTime = (dateTimeString: any) => {
        const date = new Date(dateTimeString);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return { formattedDate, formattedTime };
    }

    return (
        <Modal
            title="Video List"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width="80%"
            bodyStyle={{ padding: 0 }}
        >
            <div
                style={{ display: 'flex', height: '500px' }}>
                <div style={{ flex: 2 }}>
                    {currentVideo && (
                        <video
                            width="100%"
                            height="100%"
                            controls
                            src={`${DOMAIN_VIDEO}/api/upload/video/${currentVideo}`}
                        />
                    )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className={styles.videoItem}
                            onClick={() => handleVideoChange(video.videoPath)}
                        >
                            <div className='d-flex align-items-center'>
                                <div className="icon mr-4">
                                    <i className="fa-solid fa fa-film text-base text-white"></i>
                                </div>
                                <div className="content justify-content-center">
                                    <h5 style={{
                                        margin: 0,
                                        fontWeight: 'bold'
                                    }}>
                                        {video.title}
                                    </h5>
                                    <p style={{
                                        margin: '2px 0 0 0',
                                        fontSize: '14px'
                                    }}>
                                        {video.description}
                                    </p>
                                    <p style={{
                                        margin: '2px 0 0 0',
                                        fontSize: '14px'
                                    }}>
                                        Ngày tạo: {formatDateAndTime(video.uploadTime).formattedDate}
                                    </p>
                                    <p style={{
                                        margin: '2px 0 0 0',
                                        fontSize: '14px'
                                    }}>
                                        Thời gian tạo: {formatDateAndTime(video.uploadTime).formattedTime}
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>



            </div>
        </Modal>
    );
};

export default VideoCamBienModal;
