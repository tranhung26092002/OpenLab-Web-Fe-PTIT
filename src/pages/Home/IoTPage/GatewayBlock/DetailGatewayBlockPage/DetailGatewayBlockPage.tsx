import React, { Fragment, useEffect, useState } from 'react'
import Header from '../../../../../components/Header/Header'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DispatchType, RootState } from '../../../../../redux/configStore'
import { CommentDieuKhien, addCommentDieuKhien, fetchCommentsDieuKhien } from '../../../../../redux/CommentBaiIoT/CommentBaiKhoiDieuKhien'
import { fetchBaiKhoiDieuKhienDetail } from '../../../../../redux/GatewayBlockReducer/GatewayBlockReducer'
import { fetchVideoByBaiDieuKhienId } from '../../../../../redux/VideoGateway/VideoGatewayReducer'
import { Button } from 'antd'
import VideoDieuKhienModal from './VideoGatewayModal'
import styles from '../../Detail.module.scss'

export interface DetailSourceBlockPage {
    id: number | null;
}



const DetailControllerBlockPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = Number(queryParams.get('idGateway'));
    const [commentContent, setCommentContent] = useState('');
    const [videos, setVideos] = useState<any>([]);
    const dispatch = useDispatch<DispatchType>();

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(event.target.value);
        setCommentContent(event.target.value);
    }

    const comments = useSelector((state: RootState) => state.CommentBaiKhoiDieuKhien.comments);
    const videoList = useSelector((state: RootState) => state.VideoDieuKhienReducer.video);

    useEffect(() => {
        if (id) {
            dispatch(fetchVideoByBaiDieuKhienId(id));
        }
    }, [dispatch, id])

    useEffect(() => {
        if (videoList) {
            setVideos(videoList);
        }

    }, [videoList])

    console.log("videoList", videoList);

    const userId = useSelector((state: RootState) => state.UserReducer.userId);
    const email = useSelector((state: RootState) => state.UserReducer.email);

    console.log("comments", comments);
    console.log("userId", userId);
    const handleSubmitComment = () => {
        if (userId) {
            dispatch(addCommentDieuKhien({
                baiDieuKhienId: id,
                cmtDieuKhienContent: commentContent,
                userId: userId
            }));
            setCommentContent('');
        } else {
            console.error('Cannot determine the user ID.');
        }
    }


    const currentItem = useSelector((state: RootState) => state.ControllerBlockReducer.currentItem);
    useEffect(() => {
        dispatch(fetchBaiKhoiDieuKhienDetail(id));
    }, [dispatch, id])
    useEffect(() => {
        dispatch(fetchCommentsDieuKhien(id));
    }, [dispatch, id])

    const [modalOpen, setModalOpen] = useState(false);

    const showModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }
    return (
        <Fragment>
            <Header />
            <div className={styles.container} style={{ marginTop: '120px' }}>
                <div className="row">
                    <div className="col-10">
                        {currentItem && (
                            <div>
                                {/* <h4 className="mb-4 text-center">{currentItem.tenDieuKhien}</h4> */}
                                <div dangerouslySetInnerHTML={{ __html: currentItem.contentHtml || '' }}></div>
                            </div>
                        )}
                    </div>
                    <div className="col-2">
                        <Button onClick={showModal}>Danh sách video</Button>
                        <VideoDieuKhienModal
                            videos={videos}
                            isOpen={modalOpen}
                            onClose={closeModal}
                        />
                        <Button className='mt-2'>Vào làm bài</Button>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-start align-items-start mb-5" style={{ marginLeft: 20 }}>
                <div style={{ width: '700px', borderRadius: '12px' }}>
                    <div className="comments-section">
                        {comments.map((comment: CommentDieuKhien, index: number) => (
                            <div key={index} className="comment">
                                <strong className="d-block mb-2">{comment.user?.email}</strong>
                                <textarea
                                    key={index}
                                    style={{
                                        height: '100px',
                                        borderColor: '#ED64A6',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        padding: '0.25rem 0.75rem',
                                        cursor: 'not-allowed',
                                        resize: 'none'
                                    }}
                                    value={comment.cmtDieuKhienContent}
                                    className="form-control read-only-textarea"
                                    readOnly
                                />
                            </div>
                        ))}
                    </div>

                    <textarea
                        value={commentContent}
                        onChange={handleCommentChange}
                        className="form-control mb-3 mt-5"
                        style={{
                            height: '160px',
                            borderColor: '#ED64A6',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            padding: '0.25rem 0.75rem'
                        }}
                        placeholder="Add your comments here">
                    </textarea>

                    <div className="d-flex justify-content-between">
                        <button
                            onClick={handleSubmitComment}
                            className="btn text-white"
                            style={{ backgroundColor: '#3B82F6', width: '150px', borderRadius: '0.5rem' }}>Submit comment</button>
                    </div>
                </div>
            </div>


        </Fragment>
    )
}

export default DetailControllerBlockPage;