import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Navigate,
} from 'react-router-dom';
import { useAuth } from '../context/auth-provider';
import { ProtectedRoute } from '../routes/projected-route';
import { router } from '../index';

import 'antd/dist/reset.css';
import App from '../App';
import ErrorPage from '../error-page';
import ListOfCars from '../pages/cars-page/cars-page';
import { CarAPI } from '../api/cars-api';
import { CarPage } from '../pages/car-page/car-page';
import NotFoundPage from '../not-found';
import { LoginPage } from '../pages/login-page/login-page';
import Logout from '../pages/logout-page/logout-page';
import { RegisterPage } from '../pages/register-page/register-page';
import { TestPage } from '../pages/test_page/test-page';
import { UserPage } from '../pages/user-page/user-page';

const Routes = () => {
    const { token } = useAuth();

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: '/service',
            element: <div>Service Page</div>,
        },
        {
            path: '/about-us',
            element: <div>About Us</div>,
        },
    ];

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: '/',
            element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
            children: [
                {
                    path: '/',
                    element: <div>User Home Page</div>,
                },
                {
                    path: '/profile',
                    element: <div>User Profile</div>,
                },
                {
                    path: '/logout',
                    element: <div>Logout</div>,
                },
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users
    const routesForNotAuthenticatedOnly = [
        {
            path: '/',
            element: <div>Home Page</div>,
        },
        {
            path: '/login',
            element: <div>Login</div>,
        },
    ];

    // Combine and conditionally include routes based on authentication status
    // const router = createBrowserRouter([
    //     ...routesForPublic,
    //     ...(!token ? routesForNotAuthenticatedOnly : []),
    //     ...routesForAuthenticatedOnly,
    // ]);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route
                path="/"
                element={<App />}
                // loader={rootLoader}
                // action={rootAction}
                errorElement={<ErrorPage />}
            >
                <Route errorElement={<ErrorPage />}>
                    <Route
                        index
                        path="cars/"
                        element={<ListOfCars />}
                        loader={CarAPI.carsLoader}
                    />
                    <Route
                        path="cars/:carId"
                        element={<CarPage />}
                        loader={CarAPI.carLoader}
                        // action={carLoader}
                    />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="1" element={<TestPage />} />
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="user" element={<UserPage />} />
                        <Route
                            path="/"
                            element={<Navigate to="cars/" replace />}
                        />
                    </Route>
                    <Route path="/" element={<Navigate to="cars/" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                    // TODO проверка маршрутов
                </Route>
            </Route>
        )
    );

    // Provide the router configuration using RouterProvider
    return <RouterProvider router={router} />;
};

export default Routes;
