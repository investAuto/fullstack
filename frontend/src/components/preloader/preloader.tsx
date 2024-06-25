import React from 'react';
import { Flex, Spin } from 'antd';

export const Preloader: React.FC = () => (
    <Flex
        align="center"
        justify="center"
        style={{ height: 'calc(100vh - 148px)' }}
    >
        <Flex align="center" gap="middle">
            <Spin size="large" />
        </Flex>
    </Flex>
);
