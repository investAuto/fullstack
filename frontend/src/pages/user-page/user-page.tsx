// @ts-nocheck
import { useContext, useEffect } from 'react';
import { Typography, Button, Tooltip, Flex } from 'antd';
import { Rents } from '../../components/rents/rents';
import { useAuth } from '../../context/auth-provider';
import { Services } from '../../components/services/services';
import { useNavigate } from 'react-router-dom';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { AddServiceForm } from '../../components/service-add-form/service-add-form';
import { NavLink } from 'react-router-dom';
import { UserDataComponent } from '../../components/user-data/user-data';
import { UsersContext } from '../../context/user-context/user-context';
import { Preloader } from '../../components/preloader/preloader';

const { Text, Title } = Typography;

const API_URL = 'http://127.0.0.1:8000/api/v1/';

export const UserPage = () => {
    const { token } = useAuth();
    const { user, setUser } = useContext(UsersContext);
    const navigate = useNavigate();
    useEffect(() => {
        setUser();
    }, []);
    if (!user?.id) {
        return <Preloader />;
    }
    return (
        <>
            <Title>Это страница пользователя</Title>;
            {/* <UserDataComponent /> */}
            {user?.role === 'ADMIN' ? (
                <Button
                    type="primary"
                    icon={<PlusCircleFilled />}
                    onClick={() => navigate('/register/')}
                >
                    Зарегистрировать пользователя
                </Button>
            ) : (
                <Button
                    type="primary"
                    icon={<PlusCircleFilled />}
                    onClick={() => navigate('/services/add/')}
                >
                    Сервис
                </Button>
            )}
            <Rents />
            <Services />
        </>
    );
};
