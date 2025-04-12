import React from 'react';
import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';

interface SensorMonitorCardProps {
    name: string;
    value: number;
    unit: string;
    warningThreshold: number;
    index: number;
    icon: React.ReactNode;
}

export const SensorMonitorCard: React.FC<SensorMonitorCardProps> = ({
    name, value, unit, warningThreshold, index, icon
}) => {
    const isWarning = value > warningThreshold;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full h-full"
        >
            <Card
                className={`
          shadow-lg hover:shadow-xl transition-shadow duration-300 h-full
          ${isWarning ? 'bg-red-50' : 'bg-white'}
        `}
                bordered={false}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className={`
            text-2xl sm:text-3xl
            ${isWarning ? 'text-red-500' : 'text-gray-600'}
          `}>
                        {icon}
                    </div>
                    <Typography.Text className="text-gray-500 text-sm sm:text-base">{name}</Typography.Text>
                </div>

                <div className="mt-2">
                    <Typography.Title level={2} className={`
            mb-0 text-2xl sm:text-3xl lg:text-4xl
            ${isWarning ? 'text-red-500' : 'text-gray-700'}
          `}>
                        {value} {unit}
                    </Typography.Title>
                </div>
            </Card>
        </motion.div>
    );
};