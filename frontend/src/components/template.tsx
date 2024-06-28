// @ts-nocheck
import React, { useEffect, useContext } from 'react';
import { Props } from './template-types';
import { Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { UsersContext } from '../context/user-context/user-context';

const { Header, Content, Footer } = Layout;

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#ff7a45',
};

const contentStyle: React.CSSProperties = {
    padding: '10px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 128px)',
    color: '#fff',
    backgroundColor: '#fff2e8',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#ff7a45',
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
};

const loginButtonStyle = {
    textShadow: 'white 2px 0 10px',
};

export const Template: React.FC<Props> = ({ children }) => {
    const { user, setUser, deleteCurrentUser } = useContext(UsersContext);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' || !user.id) {
                setUser();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [user, setUser]);

    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <NavLink to={'/cars/'} style={loginButtonStyle}>
                    <div>главная</div>
                </NavLink>

                <NavLink to={'register'} style={loginButtonStyle}>
                    регистрация
                </NavLink>
                {/* TODO здесь остаётся имя пользователя если выйти как это исправить */}
                {user?.fullname ? (
                    <>
                        <NavLink to={'/user/'} style={loginButtonStyle}>
                            {user.fullname}
                        </NavLink>
                        <NavLink
                            to={'/logout'}
                            style={loginButtonStyle}
                            onClick={() => deleteCurrentUser()}
                        >
                            <UserOutlined /> Выйти
                        </NavLink>
                    </>
                ) : (
                    <NavLink to={'login'} style={loginButtonStyle}>
                        <UserOutlined />
                        Войти
                    </NavLink>
                )}
            </Header>
            <Content style={contentStyle}>{children}</Content>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    );
};
