// @ts-nocheck
import { useContext } from 'react';
import { UsersContext } from '../../context/user-context/user-context';
import { useAuth } from '../../context/hook_use_auth';
import { Preloader } from '../preloader/preloader';

export const UserDataComponent = () => {
    // TODO это временный компонент для получения пользователя

    const { user } = useContext(UsersContext);
    const { token } = useAuth();
    if (!user?.id || !token) {
        return <Preloader />;
    }
    return (
        <div style={{ color: 'black' }}>
            <h3>{user.id}</h3>
            <h3>{user.phone}</h3>
            <span>{user.role}</span>
            <h3>{user.fullname}</h3>
        </div>
    );
};
