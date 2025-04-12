import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Layout } from 'antd';
import { motion } from 'framer-motion';
import {
  DashboardOutlined,
  ChromeOutlined,
  DashboardFilled,
  BulbOutlined,
  AlertOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  NotificationOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { useSensorData } from '../hooks/useSensorData';
import { SensorMonitorCard } from '../components/dashboard/SensorMonitorCard';
import { DeviceControlCard } from '../components/dashboard/DeviceControlCard';
import { SensorChart } from '../components/dashboard/SensorChart';
import CustomHeader from '../components/header/Header';

const { Header } = Layout;

interface SensorHistory {
  temperature: Array<{ time: string; value: number }>;
  humidity: Array<{ time: string; value: number }>;
  light: Array<{ time: string; value: number }>;
  gas: Array<{ time: string; value: number }>;
}

const DashboardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lastUpdateTime = useRef<number>(Date.now());
  const UPDATE_INTERVAL = 2000; // 2 seconds between updates
  const {
    sensorData,
    toggleLed,
    toggleBuzzer,
    toggleFan,
    toggleAlertLed,
    toggleServo
  } = useSensorData(id || '');

  const [sensorHistory, setSensorHistory] = useState<SensorHistory>({
    temperature: [],
    humidity: [],
    light: [],
    gas: []
  });

useEffect(() => {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime.current >= UPDATE_INTERVAL) {
      const timestamp = new Date().toLocaleTimeString();
      
      setSensorHistory(prev => {
        const newHistory = {
          temperature: [...prev.temperature, { time: timestamp, value: sensorData.sensors.temperature }],
          humidity: [...prev.humidity, { time: timestamp, value: sensorData.sensors.humidity }],
          light: [...prev.light, { time: timestamp, value: sensorData.sensors.light }],
          gas: [...prev.gas, { time: timestamp, value: sensorData.sensors.gas }]
        };

        // Keep only last 10 points for each sensor
        Object.keys(newHistory).forEach(key => {
          if (newHistory[key as keyof SensorHistory].length > 10) {
            newHistory[key as keyof SensorHistory] = newHistory[key as keyof SensorHistory].slice(-10);
          }
        });

        lastUpdateTime.current = currentTime;
        return newHistory;
      });
    }
  }, [sensorData]);

  const sensorConfigs = [
    {
      name: "Temperature",
      value: sensorData.sensors.temperature,
      unit: "°C",
      threshold: 30,
      icon: <ChromeOutlined />,
      color: "#f5222d"
    },
    {
      name: "Humidity",
      value: sensorData.sensors.humidity,
      unit: "%",
      threshold: 80,
      icon: <DashboardFilled />,
      color: "#1890ff"
    },
    {
      name: "Light",
      value: sensorData.sensors.light,
      unit: "lux",
      threshold: 1000,
      icon: <BulbOutlined />,
      color: "#faad14"
    },
    {
      name: "Gas",
      value: sensorData.sensors.gas,
      unit: "ppm",
      threshold: 100,
      icon: <ApiOutlined />,
      color: "#722ed1"
    }
  ];

  return (
    <>
      <Header className="header sticky top-0 z-50 bg-white shadow-sm">
        <CustomHeader />
      </Header>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <Typography.Title level={2} className="text-[#2c4a2d] flex items-center gap-2 text-base sm:text-lg lg:text-2xl">
            <DashboardOutlined /> Dashboard
          </Typography.Title>
        </motion.div>

        <Row gutter={[16, 16]} className="mb-4 sm:mb-6 lg:mb-8">
          {sensorConfigs.map((sensor, index) => (
            <Col xs={24} sm={12} lg={6} key={sensor.name} className="h-[160px]">
              <SensorMonitorCard
                key={sensor.name}
                name={sensor.name}
                value={sensor.value}
                unit={sensor.unit}
                warningThreshold={sensor.threshold}
                index={index}
                icon={sensor.icon}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mb-4 sm:mb-6 lg:mb-8">
          <Col xs={24} sm={12} lg={6} className="h-[160px]">
            <DeviceControlCard
              name="LED"
              status={sensorData.status.led}
              onToggle={toggleLed}
              index={0}
              icon={<BulbOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6} className="h-[160px]">
            <DeviceControlCard
              name="Buzzer"
              status={sensorData.status.buzzer}
              onToggle={toggleBuzzer}
              index={1}
              icon={<NotificationOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6} className="h-[160px]">
            <DeviceControlCard
              name="Fan"
              status={sensorData.status.fan}
              onToggle={toggleFan}
              index={2}
              icon={<ThunderboltOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6} className="h-[160px]">
            <DeviceControlCard
              name="Alert LED"
              status={sensorData.status.alert_led}
              onToggle={toggleAlertLed}
              index={3}
              icon={<AlertOutlined />}
            />
          </Col>
          {/* <Col xs={24} sm={12} lg={6} className="h-[160px]">
            <DeviceControlCard
              name="Servo"
              status={sensorData.status.servo}
              onToggle={toggleServo}
              index={4}
              icon={<RobotOutlined />}
            />
          </Col> */}
        </Row>

        <Row gutter={[16, 16]}>
          {Object.entries(sensorHistory).map(([key, data], index) => (
            <Col xs={24} md={12} key={key}>
              <SensorChart
                name={key}
                data={data}
                index={index}
                color={sensorConfigs[index].color}
              />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default DashboardDetail;