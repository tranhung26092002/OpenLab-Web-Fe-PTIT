import React, { Fragment, ReactEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { Button, Collapse, Modal, Input, List, Upload, Form, message, Progress, notification, Popconfirm, UploadFile } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { DOMAIN_VIDEO, http } from '../../util/config';
import styles from './VideoBaiGrammar.module.scss';
import { CamBienWithVideoResponse, VideoBaiCamBienResponse, addVideoToCamBien, deleteVideoFromCamBien, fetchAllCamBienWithVideo, updateVideoInCamBien } from '../../redux/VideoNode/VideoNodeReducer';

const { Panel } = Collapse;

type VideoFormDataCamBien = {
    videoId: number | null;
    file?: File | any;
    title: string;
    description: string;
    camBienId: number;
};

const VideoBaiCamBien: React.FC = () => {
    const allVideoBaiCamBien = useSelector((state: RootState) => state.VideoCamBienReducer.camBienWithVideos) as CamBienWithVideoResponse[] | null;


    const dispatch: DispatchType = useDispatch();
    console.log("allVideoBaiCamBien", allVideoBaiCamBien);
    useEffect(() => {
        dispatch(fetchAllCamBienWithVideo());
    }, [dispatch])

    const initializeVideoFormDataCamBien = (camBienId?: number): VideoFormDataCamBien => ({
        videoId: null,
        title: "",
        description: "",
        camBienId: camBienId ?? 0
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVideoPath, setSelectedVideoPath] = useState<string | null | undefined>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editVideoData, setEditVideoData] = useState<VideoFormDataCamBien>(initializeVideoFormDataCamBien());
    const [editForm] = Form.useForm();
    const [selectedFile, setSelectedFile] = useState(null);

    const showModal = (videoPath: string) => {
        setSelectedVideoPath(videoPath);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    const [videoFormData, setVideoFormData] = useState<VideoFormDataCamBien>(initializeVideoFormDataCamBien());

    const handlePanelChange = (activeKey: string | string[]) => {
        // Đối với Ant Design, activeKey có thể là một string hoặc một mảng của string
        // Bạn cần lấy ra baiGrammarId chính xác từ activeKey
        const newBaiCamBienId = Array.isArray(activeKey) ? Number(activeKey[0]) : Number(activeKey);
        console.log("Selected baiCamBienId", newBaiCamBienId);
        setVideoFormData(initializeVideoFormDataCamBien(newBaiCamBienId));
    };



    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log("Input change detected:", name, value);
        setVideoFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmitVideo = async () => {
        // Kiểm tra xem videoFile có tồn tại không
        if (!videoFile || !videoFormData.title.trim()) {
            notification.error({
                message: 'Error',
                description: 'Please fill in all required fields!',
            });
            return;
        }

        const data = {
            file: videoFile,
            title: videoFormData.title,
            description: videoFormData.description,
            baiCamBienId: videoFormData.camBienId
        };

        console.log("videoFormData", videoFormData);
        const response = await dispatch(addVideoToCamBien(data));
        try {
            console.log("response", response);
            if (response.payload.status === 200) {
                notification.success({
                    message: "Success",
                    description: response.payload.message,
                });
                dispatch(fetchAllCamBienWithVideo());
            } else {
                notification.error({
                    message: 'Error',
                    description: response.payload.message,
                });
            }
        } catch (error) {
            console.log("error", error);
            notification.error({
                message: 'Error',
                description: response.payload.message,
            });
        }



    };

    const showEditModal = (videoItem: VideoBaiCamBienResponse, camBienId: number) => {
        setEditVideoData({
            videoId: videoItem.id,
            title: videoItem.title,
            description: videoItem.description,
            camBienId: camBienId,
            file: undefined
        });
        console.log("baiCamBienId", videoItem);
        editForm.setFieldsValue({
            title: videoItem.title,
            description: videoItem.description,
        });
        setEditModalVisible(true);
    };

    const handleEditInputChange = (changedValues: any) => {
        setEditVideoData(prev => ({ ...prev, ...changedValues }));
    };

    const handleEditSubmit = async () => {

        // console.log('Edit submit clicked');
        const formData = new FormData();
        Object.entries(editVideoData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, typeof value === 'number' ? value.toString() : value);
            }
        });

        console.log("editVideoData", editVideoData)

        const { videoId, ...videoDataWithoutId } = editVideoData;
        await handleSubmitEditVideo({ videoId, ...videoDataWithoutId });
        setEditModalVisible(false);
    };

    const handleSubmitEditVideo = async (videoData: VideoFormDataCamBien) => {


        const formData = new FormData();

        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        formData.append('title', videoData.title);
        formData.append('description', videoData.description);

        console.log("updated video", videoData.file);

        try {
            if (videoData.videoId != null) {
                await dispatch(updateVideoInCamBien({
                    file: videoData.file?.file,
                    title: videoData.title,
                    description: videoData.description,
                    videoId: videoData.videoId,
                    baiCamBienId: videoData.camBienId,
                })).unwrap();

                notification.success({
                    message: 'Update Successful',
                    description: 'The video has been updated successfully.',
                });
                dispatch(fetchAllCamBienWithVideo())
            } else {
                notification.success({
                    message: 'Update Error',
                    description: 'The title and description is not empty',
                });
            }
        } catch (error) {
            console.log("error", error);
            notification.error({
                message: 'Update Error',
                description: 'There was a problem updating the video.',
            });
        }
    };
    // console.log('Handle submit function:', handleSubmitEditVideo);
    console.log('Submitting the following data:', editVideoData);


    const handleDeleteVideo = async (videoId: number, baiCamBienId: number) => {
        await dispatch(deleteVideoFromCamBien({ videoId, baiCamBienId })).unwrap();
        try {
            notification.success({
                message: 'Deleted Successful',
                description: 'The video has been deleted successfully.',
            });
            dispatch(fetchAllCamBienWithVideo());
        } catch (error) {
            notification.success({
                message: "Error",
                description: "The video has been deleted failed.",
            });
        }
    };


    const uploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file: File) => {
            console.log("File selected:", file);
            setVideoFile(file);
            return false;
        },
        customRequest: async (options: any) => {
            const { file } = options;

            const formData = new FormData();
            formData.append('file', file);

            try {
                await http.post("/api/baicambien/create", formData);
                options.onSuccess();
            } catch (error) {
                options.onError(error);
            }
        }
    };





    return (
        <Fragment>
            <Collapse className={styles.jittery} onChange={handlePanelChange}>
                {allVideoBaiCamBien?.map((camBienWithVideo: CamBienWithVideoResponse) => (
                    <Panel header={camBienWithVideo.camBienWithVideoDTO.tenBaiCamBien} key={camBienWithVideo.camBienWithVideoDTO.camBienId}>
                        <Form layout="vertical" onFinish={handleSubmitVideo}>
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Upload Video</Button>
                            </Upload>
                            <Form.Item label="Title">
                                <Input name="title" value={videoFormData.title} onChange={handleInputChange} placeholder="Title" />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input name="description" value={videoFormData.description} onChange={handleInputChange} placeholder="Description" />
                            </Form.Item>
                            {/* Ẩn input baiGrammarId và tự động gán giá trị cho nó */}
                            <Form.Item style={{ display: 'none' }}>
                                <Input name="baiCamBienId" value={videoFormData.camBienId} onChange={handleInputChange} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">Add Video</Button>
                            </Form.Item>
                        </Form>
                        <List
                            dataSource={camBienWithVideo.videos}
                            renderItem={(videoItem: VideoBaiCamBienResponse) => {
                                const baiCamBienId = camBienWithVideo.camBienWithVideoDTO.camBienId;
                                return (
                                    <List.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 3 }}>
                                            <div>
                                                <strong>Title:</strong> {videoItem.title}
                                            </div>
                                            <div>
                                                <strong>Description:</strong> {videoItem.description}
                                            </div>
                                        </div>
                                        <Button style={{ flex: 1, marginRight: '5px' }} onClick={() => showModal(videoItem.videoPath)}>
                                            Watch video
                                        </Button>
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                type='primary'
                                                style={{ marginRight: '5px' }} onClick={() => showEditModal(videoItem, baiCamBienId)}>
                                                <EditOutlined />
                                            </Button>
                                            <Popconfirm
                                                title="Are you sure you want to delete this entry?"
                                                onConfirm={() => handleDeleteVideo(videoItem.id, camBienWithVideo.camBienWithVideoDTO.camBienId)}
                                                onCancel={() => console.log('Cancelled delete for:', videoItem.id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button danger>
                                                    <DeleteOutlined />
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    </List.Item>

                                );
                            }}

                        />
                    </Panel>
                ))}
            </Collapse>
            <Modal
                title="Edit Video"
                open={editModalVisible}
                onOk={handleEditSubmit}
                onCancel={() => setEditModalVisible(false)}
            >
                <Form
                    form={editForm}
                    onFinish={handleEditSubmit}
                    onValuesChange={handleEditInputChange}
                >
                    <Form.Item name="title" label="Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>
                    <Form.Item name="file" label="File">
                        <Upload
                            name="video"
                            maxCount={1}
                            listType='picture'
                            beforeUpload={(file: any) => {
                                setSelectedFile(file);
                                // mô phỏng việc upload, không thực sự gửi file lên server
                                console.log("File được chọn:", file);
                                return false; // Trả về false để ngăn chặn việc gửi yêu cầu HTTP
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="baiCamBienId" style={{ display: 'none' }}>
                        <Input name="baiCamBienId" hidden />
                    </Form.Item>


                </Form>
            </Modal>
            <Modal title="Video Player" open={isModalVisible} onCancel={handleCancel} footer={null} width={720}>
                <video key={selectedVideoPath} width="100%" controls>
                    <source src={`${DOMAIN_VIDEO}/api/upload/video/${selectedVideoPath}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </Modal>
        </Fragment>
    )
}

export default VideoBaiCamBien;
