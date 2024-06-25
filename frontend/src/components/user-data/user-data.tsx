// @ts-nocheck
import { useContext, useEffect } from 'react';
import { UsersContext } from '../../context/user-context/user-context';

export const UserDataComponent = () => {
    // TODO это временный компонент для получения пользователя
    const { user, setUser } = useContext(UsersContext);
    useEffect(() => {
        setUser();
    }, []);
    if (!user?.id) {
        return <h1>Подождите...</h1>;
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
