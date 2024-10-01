import React, { Fragment } from 'react';
import styles from './Home.module.scss';
import Header from '../../components/Header/Header';
import { NavLink } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

type Props = {}

export const Home = (props: Props) => {
    return (
        <Fragment>
            <Header />
            <h2>THỰC HÀNH CHUYÊN SÂU IoT</h2>
            <div className={styles.container}>               
                <div className={styles.contentSection}>
                    <div className={styles.contentText}>
                        <NavLink to="/home/IoT" className={styles.link}>TÀI LIỆU</NavLink><br />
                        <NavLink to="/home/DashBoard" className={styles.link}>DASHBOARD</NavLink><br />
                        <NavLink to="/home/BrokerMQTT" className={styles.link}>BROKERMQTT</NavLink><br />
                        <NavLink to="/home/Report" className={styles.link}>REPORT</NavLink><br />
                        <NavLink to="/home/DeviceManger" className={styles.link}>DEVICEMANAGER</NavLink><br />
                    </div>
                    <div className={styles.contentImage}>
                        <img src={require('../../assets/img/Screenshot from 2023-10-03 18-47-11.png')} alt="" />
                    </div>
                </div>
                <Footer />
            </div>

        </Fragment>
    )
}
