import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();
// TODO посмотреть как здесь всё работает ещё раз
const AuthProvider = ({ children }) => {
    // Component content goes here
    const [token, setToken_] = useState(localStorage.getItem('token'));
    // const [user, setUser_] = useState(localStorage.getItem('user'));

    const setToken = (newToken) => {
        setToken_(newToken);
    };
    // const setUser = (newUser) => {
    //     setUser_(newUser);
    // };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            // user,
            // setUser,
            token,
            setToken,
        }),
        [token]
    );
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
