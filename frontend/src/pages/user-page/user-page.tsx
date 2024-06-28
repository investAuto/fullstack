// @ts-nocheck
import { useContext, useEffect } from 'react';
import { Typography, Button } from 'antd';
import { Rents } from '../../components/rents/rents';
import { Services } from '../../components/services/services';
import { useNavigate } from 'react-router-dom';
import { PlusCircleFilled } from '@ant-design/icons';
import { UsersContext } from '../../context/user-context/user-context';
import { Preloader } from '../../components/preloader/preloader';

const { Title } = Typography;

export const UserPage = () => {
    const { user, setUser } = useContext(UsersContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.id) {
            setUser();
        }
        // setUser();
        // TODO если установить setUser в зависимости он будет бесконечно выполняться
    }, [user, setUser]);

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
