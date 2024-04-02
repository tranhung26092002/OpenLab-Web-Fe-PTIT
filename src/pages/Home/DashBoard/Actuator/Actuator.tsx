import React, { Fragment, useState } from 'react';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import style from '../Sensor/Sensor.module.scss'; // Import file SCSS
import * as Icon from '@mui/icons-material';
import 'firebase/database'; // Import module cho Firebase Database
import app from '../../../../util/firebase';
import { getDatabase, ref, update } from "firebase/database"

const Actuator = () => {
    //Buzzer
    const [buzzerStatus, setBuzzerStatus] = useState(Array(5).fill(false));

    const handleBuzzer = async (index: number) => {
        const db = getDatabase(app);
        const buzzerRef = ref(db, `button/${index}`); // Sử dụng index để xác định topic cho mỗi button

        try {
            await update(buzzerRef, { status: !buzzerStatus[index] }); // Thay đổi trạng thái của buzzer tương ứng với topic
            setBuzzerStatus(prevStatus => {
                const newStatus = [...prevStatus];
                newStatus[index] = !prevStatus[index];
                return newStatus;
            }); // Cập nhật trạng thái trong ứng dụng của bạn
        } catch (error) {
            console.error("Error updating Buzzer status:", error);
        }
    };

    const BuzzerBlock: React.FC<{ title: string, index: number }> = ({ title, index }) => (
        <div className={style.Block}>
            {buzzerStatus[index] ? <Icon.NotificationsActiveOutlined fontSize="large" /> : <Icon.NotificationsNoneOutlined fontSize="large" />}
            <div className={style.Info}>
                <h4>{title}</h4>
            </div>
            <button onClick={() => handleBuzzer(index)}>{buzzerStatus[index] ? 'Tắt' : 'Bật'}</button>
        </div>
    );

    //Fan
    const [fanStatus, setFanStatus] = useState(Array(5).fill(false));

    const handleFan = async (index: number) => {
        const db = getDatabase(app);
        const fanRef = ref(db, `fan/${index}`); // Sử dụng index để xác định topic cho mỗi fan

        try {
            await update(fanRef, { status: !fanStatus[index] }); // Thay đổi trạng thái của fan tương ứng với topic
            setFanStatus(prevStatus => {
                const newStatus = [...prevStatus];
                newStatus[index] = !prevStatus[index];
                return newStatus;
            }); // Cập nhật trạng thái trong ứng dụng của bạn
        } catch (error) {
            console.error("Error updating Fan status:", error);
        }
    };

    const FanBlock: React.FC<{ title: string, index: number }> = ({ title, index }) => (
        <div className={style.Block}>
            {fanStatus[index] ? <Icon.ModeOutlined fontSize="large" /> : <Icon.ModeFanOffOutlined fontSize="large" />}
            <div className={style.Info}>
                <h4>{title}</h4>
            </div>
            <button onClick={() => handleFan(index)}>{fanStatus[index] ? 'Tắt' : 'Bật'}</button>
        </div>
    );

    //Led
    const [ledStatus, setLedStatus] = useState(Array(5).fill(false));

    const handleLed = async (index: number) => {
        const db = getDatabase(app);
        const ledRef = ref(db, `led/${index}`); // Sử dụng index để xác định topic cho mỗi led

        try {
            await update(ledRef, { status: !ledStatus[index] }); // Thay đổi trạng thái của led tương ứng với topic
            setLedStatus(prevStatus => {
                const newStatus = [...prevStatus];
                newStatus[index] = !prevStatus[index];
                return newStatus;
            }); // Cập nhật trạng thái trong ứng dụng của bạn
        } catch (error) {
            console.error("Error updating LED status:", error);
        }
    };

    const LedBlock: React.FC<{ title: string, index: number }> = ({ title, index }) => (
        <div className={style.Block}>
            {ledStatus[index] ? <Icon.HighlightOutlined fontSize="large" /> : <Icon.HighlightOffOutlined fontSize="large" />}
            <div className={style.Info}>
                <h4>{title}</h4>
            </div>
            <button onClick={() => handleLed(index)}>{ledStatus[index] ? 'Tắt' : 'Bật'}</button>
        </div>
    );

    //Servo
    const [servoStatus, setServoStatus] = useState(Array(5).fill(false));

    const handleServo = async (index: number) => {
        setServoStatus(prevStatus => {
            const newStatus = [...prevStatus];
            newStatus[index] = !prevStatus[index];
            return newStatus;
        }); // Cập nhật trạng thái trong ứng dụng của bạn
    };

    const ServoBlock: React.FC<{ title: string, index: number }> = ({ title, index }) => (
        <div className={style.Block}>
            {servoStatus[index] ? <Icon.AirplanemodeActiveOutlined fontSize="large" /> : <Icon.HighlightOffOutlined fontSize="large" />}
            <div className={style.Info}>
                <h4>{title}</h4>
            </div>
            <button onClick={() => handleServo(index)}>{servoStatus[index] ? 'Tắt' : 'Bật'}</button>
        </div>
    );

    return (
        <Fragment>
            <Header />
            <div>
                <h2>DashBoard</h2>
                <div className={style.Container}>
                    <div className={style.LeftContainer}>
                        <h3>Khối còi</h3>
                        <div className={style.SensorGrid}>
                            {[1, 2, 3, 4, 5].map(index => (
                                <BuzzerBlock key={`buzzer_${index}`} title={`Còi ${index}`} index={index} />
                            ))}
                        </div>
                    </div>
                    <div className={style.RightContainer}>
                        <h3>Khối quạt</h3>
                        <div className={style.SensorGrid}>
                            {[1, 2, 3, 4, 5].map(index => (
                                <FanBlock key={`fan_${index}`} title={`Quạt ${index}`} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className={style.Container}>
                    <div className={style.LeftContainer}>
                        <h3>Khối LED</h3>
                        <div className={style.SensorGrid}>
                            {[1, 2, 3, 4, 5].map(index => (
                                <LedBlock key={`led_${index}`} title={`Led ${index}`} index={index} />
                            ))}
                        </div>
                    </div>
                    <div className={style.RightContainer}>
                        <h3>Khối Servo</h3>
                        <div className={style.SensorGrid}>
                            {[1, 2, 3, 4, 5].map(index => (
                                <ServoBlock key={`servo_${index}`} title={`Servo ${index}`} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}
export default Actuator;
