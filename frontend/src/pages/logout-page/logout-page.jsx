import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';
import { useEffect } from 'react';

const Logout = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO как здесь удалить localStorage
        setToken();
        localStorage.removeItem('phone');
        navigate('/cars', { replace: true });
    };

    useEffect(() => {
        handleLogout();
    }, [token]);

    return (
        <>
            <h1 style={{ color: 'black' }}>Logout Page</h1>
        </>
    );
};

export default Logout;
