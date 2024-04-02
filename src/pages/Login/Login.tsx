import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/UserReducer/UserReducer';
import { DispatchType } from '../../redux/configStore';
import styles from './Login.module.scss';
import { notification } from 'antd';
// import { auth } from '../../util/firebase';
// import { signInWithCustomToken } from 'firebase/auth';

type Props = {}

export const Login: React.FC<Props> = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch: DispatchType = useDispatch();

    const handlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const loginData = {
            email: email,
            password: password
        }



        dispatch(loginUser(loginData)).then((action: any) => {

            if (action.payload.status === 200) {
                //Dang nhap thanh cong xac thuc firebase
                notification.success({
                    message: 'Thành công',
                    description: 'Đăng nhập thành công!'
                });
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Đăng nhập thất bại. Vui lòng thử lại!'
                });
            }
        }).catch((error) => {
            // Xử lý trường hợp gặp lỗi khi gọi API
            notification.error({
                message: 'Lỗi',
                description: 'Đăng nhập thất bại. Vui lòng thử lại!'
            });
        });
        // // console.log("loginData", loginData);

    }

    return (
        <Fragment>
            
            <div className={styles.mainContainer}>
                <div className={styles.contentCenter}>
                    <div className="text-center text-danger">
                        <h1>OpenLAB</h1>
                    </div>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoLeft}>
                            <img src={require('../../assets/img/f1d0d614e2c636986fd7.jpg')} alt="logo_left" />
                        </div>
                        <div className={styles.loginContainer}>
                            {/* <h2>OPEN LAB</h2> */}
                            <form onSubmit={handlSubmit}>
                                <div className="mb-4">
                                    <label>User:</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                        required />
                                </div>
                                <div className="mb-4">
                                    <label>Password:</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        required />
                                </div>
                                <button className='bg-danger' type='submit'>Đăng nhập</button>
                            </form>
                        </div>
                        <div className={styles.logoRight}>
                            <img src={require('../../assets/img/7a199d671006c4589d17.jpg')} alt="logo_right" />
                        </div>
                    </div>
                </div>
                <div style={{
                    fontSize: 30,
                    backgroundColor: 'red',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '15vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} className={styles.footerContainer}>
                    THỰC HÀNH CHUYÊN SÂU IoT
                </div>
            </div>

        </Fragment>
    )
}