import React, { Fragment } from 'react';
import styles from '../Home.module.scss';
import Header from '../../../components/Header/Header';
import { NavLink } from 'react-router-dom';
import Footer from '../../../components/Footer/Footer';

const IoTPage = () => {
    return (
        <Fragment>
            <Header />
            <h2>THỰC HÀNH CHUYÊN SÂU IoT</h2>
            <div className={styles.container}>               
                <div className={styles.contentSection}>
                    <div className={styles.contentText}>
                        <NavLink to="/home/IoT/IoTNode" className={styles.link}>LỚP THIẾT BỊ : BUỔI I, BUỔI II,BUỔI III.</NavLink><br />
                        <NavLink to="/home/IoT/IoTGateway" className={styles.link}>LỚP MẠNG : BUỔI IV, BUỔI V.</NavLink><br />
                        <NavLink to="/home/IoT/IoTCloud" className={styles.link}>LỚP ỨNG DỤNG : BUỔI VI, BUỔI VII.</NavLink><br />
                    </div>
                    <div className={styles.contentImage}>
                        <img src={require('../../../assets/img/Screenshot from 2023-10-03 18-47-11.png')} alt="" />
                    </div>
                </div>
                <Footer />
            </div>

        </Fragment>
    )
}
export default IoTPage;

