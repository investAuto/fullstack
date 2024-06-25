import { useState } from 'react';
import { Typography, Button, Tooltip, Flex } from 'antd';
import { Rents } from '../../components/rents/rents';
import { useAuth } from '../../context/auth-provider';
import { Services } from '../../components/services/services';
import { useNavigate } from 'react-router-dom';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { AddServiceForm } from '../../components/service-add-form/service-add-form';
import { NavLink } from 'react-router-dom';
import { UserDataComponent } from '../../components/user-data/user-data';

const { Text, Title } = Typography;

const API_URL = 'http://127.0.0.1:8000/api/v1/';

export const UserPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <UserDataComponent />
            <Button
                type="primary"
                icon={<PlusCircleFilled />}
                onClick={() => navigate('/services/add/')}
            >
                Сервис
            </Button>
            <Title>Это страница пользователя</Title>;
            <Rents />
            <Services />
        </>
    );
};
