import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    redirect,
    Navigate,
} from 'react-router-dom';
// import './index.css';
import 'antd/dist/reset.css';
import App from './App';
import ErrorPage from './error-page';
import ListOfCars from './pages/cars-page/cars-page';
import { CarAPI } from './api/cars-api';
import { CarPage } from './pages/car-page/car-page';
import NotFoundPage from './not-found';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { TestPage } from './pages/test_page/test-page';
import { UserPage } from './pages/user-page/user-page';
import { UserProvider } from './context/user-context';
// TODO пробные импорты
import AuthProvider from './context/auth-provider';
import { useAuth } from './context/auth-provider';
import { ProtectedRoute } from './routes/projected-route';
import Routes from './routes/routes';
import { UsersState } from './context/user-context/user-state';

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <App />,
//     },
// ]);

// const Routes = () => {
//     const { token } = useAuth();
//     // Route configurations go here
// };

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
