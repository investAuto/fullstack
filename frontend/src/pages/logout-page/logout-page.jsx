import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/hook_use_auth';
import { useEffect } from 'react';
import { UsersContext } from '../../context/user-context/user-context';

export const Logout = () => {
    const { deleteCurrentUser } = useContext(UsersContext);
    const { setToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            setToken();
            navigate('/cars', { replace: true });
        };
        handleLogout();
        deleteCurrentUser();
    }, [deleteCurrentUser, setToken, navigate]);

    return (
        <>
            <h1 style={{ color: 'black' }}>Logout Page</h1>
        </>
    );
};
