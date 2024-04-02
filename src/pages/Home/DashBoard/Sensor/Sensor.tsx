import React, { Fragment, useState, useEffect } from 'react';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import style from './Sensor.module.scss'; // Import file SCSS
import * as Icon from '@mui/icons-material';
import 'firebase/database'; // Import module cho Firebase Database
import app from '../../../../util/firebase';
import { getDatabase, ref, onValue } from "firebase/database"

const Sensor = () => {
    let [temperatureLevels, setTemperatureLevels] = useState(Array(5).fill(null));
    let [humidityLevels, setHumidityLevels] = useState(Array(5).fill(null));
    let [gasLevels, setGasLevels] = useState(Array(5).fill(null));
    let [lightLevels, setLightLevels] = useState(Array(5).fill(null));

    useEffect(() => {
        const db = getDatabase(app);

        const sensorPaths = Array.from({ length: 5 }, (_, i) => ({
            temperature: `Sensor/temperature/${i + 1}`,
            humidity: `Sensor/humidity/${i + 1}`,
            gas: `Sensor/gas/${i + 1}`,
            light: `Sensor/light/${i + 1}`,
        }));

        const sensorRefs = sensorPaths.map(({ temperature, humidity, gas, light }) => ({
            temperature: ref(db, temperature),
            humidity: ref(db, humidity),
            gas: ref(db, gas),
            light: ref(db, light)
        }));

        // const setters = [
        //     setTemperatureLevels,
        //     setHumidityLevels,
        //     setGasLevels,
        //     setLightLevels,
        // ];

        const unsubscribeFunctions = sensorRefs.map((refs, index) => {
            return [
                onValue(refs.temperature, (snapshot) => updateState(snapshot, index, 'temperature')),
                onValue(refs.humidity, (snapshot) => updateState(snapshot, index, 'humidity')),
                onValue(refs.gas, (snapshot) => updateState(snapshot, index, 'gas')),
                onValue(refs.light, (snapshot) => updateState(snapshot, index, 'light'))
            ];
        }).flat();

        // Trả về hàm để dừng lắng nghe khi component unmount
        return () => {
            unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
        };
    }, []);

    const updateState = (snapshot: any, index: number , type: string) => {
        if (snapshot.exists()) {
            const sensorData = snapshot.val();
            switch (type) {
                case 'temperature':
                    setTemperatureLevels(prevLevels => [...prevLevels.slice(0, index), sensorData, ...prevLevels.slice(index + 1)]);
                    break;
                case 'humidity':
                    setHumidityLevels(prevLevels => [...prevLevels.slice(0, index), sensorData, ...prevLevels.slice(index + 1)]);
                    break;
                case 'gas':
                    setGasLevels(prevLevels => [...prevLevels.slice(0, index), sensorData, ...prevLevels.slice(index + 1)]);
                    break;
                case 'light':
                    setLightLevels(prevLevels => [...prevLevels.slice(0, index), sensorData, ...prevLevels.slice(index + 1)]);
                    break;
                default:
                    break;
            }
        } else {
            switch (type) {
                case 'temperature':
                    setTemperatureLevels(prevLevels => [...prevLevels.slice(0, index), null, ...prevLevels.slice(index + 1)]);
                    break;
                case 'humidity':
                    setHumidityLevels(prevLevels => [...prevLevels.slice(0, index), null, ...prevLevels.slice(index + 1)]);
                    break;
                case 'gas':
                    setGasLevels(prevLevels => [...prevLevels.slice(0, index), null, ...prevLevels.slice(index + 1)]);
                    break;
                case 'light':
                    setLightLevels(prevLevels => [...prevLevels.slice(0, index), null, ...prevLevels.slice(index + 1)]);
                    break;
                default:
                    break;
            }
        }
    };

    const SensorBlock: React.FC<{ title: string, value: any, icon: any }> = ({ title, value, icon }) => (
        <div className={style.Block}>
            {React.createElement(icon, { fontSize: 'large' })}
            <div className={style.Info}>
                <h4>{title}</h4>
                <p>{value}</p>
            </div>
        </div>
    );

    return (
        <Fragment>
            <Header />
            <div>
                <h2>DashBoard</h2>
                <div className={style.Container}>
                    <div className={style.LeftContainer}>
                        <h3>Khối nhiệt độ</h3>
                        <div className={style.SensorGrid}>
                            {temperatureLevels.map((temperature, index) => (
                                <SensorBlock key={`temperature_${index}`} title={`Nhiệt độ ${index + 1}`} value={`${temperature} °C`} icon={Icon.ThermostatOutlined} />
                            ))}
                        </div>
                    </div>
                    <div className={style.RightContainer}>
                        <h3>Khối độ ẩm</h3>
                        <div className={style.SensorGrid}>
                            {humidityLevels.map((humidity, index) => (
                                <SensorBlock key={`humidity_${index}`} title={`Độ ẩm ${index + 1}`} value={`${humidity} %`} icon={Icon.OpacityOutlined} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className={style.Container}>
                    <div className={style.LeftContainer}>
                        <h3>Khối khí gas</h3>
                        <div className={style.SensorGrid}>
                            {gasLevels.map((gas, index) => (
                                <SensorBlock key={`gas_${index}`} title={`Khí gas ${index + 1}`} value={`${gas} ppm`} icon={Icon.AirOutlined} />
                            ))}
                        </div>
                    </div>
                    <div className={style.RightContainer}>
                        <h3>Khối ánh sáng</h3>
                        <div className={style.SensorGrid}>
                            {lightLevels.map((light, index) => (
                                <SensorBlock key={`light_${index}`} title={`Ánh sáng ${index + 1}`} value={`${light} lux`} icon={Icon.LightModeOutlined} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}
export default Sensor;
