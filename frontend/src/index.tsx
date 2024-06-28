import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import { AuthProvider } from './context/auth-provider';
import { Routes } from './routes/routes';
import { UsersState } from './context/user-context/user-state';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <UsersState>
                <Routes />
            </UsersState>
        </AuthProvider>
    </React.StrictMode>
);
