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
import { Rents } from '../components/rents/rents';
import NotFoundPage from '../not-found';
import { LoginPage } from '../pages/login-page/login-page';
import Logout from '../pages/logout-page/logout-page';
import { RegisterPage } from '../pages/register-page/register-page';
import { TestPage } from '../pages/test_page/test-page';
import { UserPage } from '../pages/user-page/user-page';
import { AddServiceForm } from '../components/service-add-form/service-add-form';
import { EditServiceForm } from '../components/service-edit-form/service-edit-form';

const Routes = () => {
    const { token } = useAuth();

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
                        <Route
                            path="services/:serviceId/edit/"
                            element={<EditServiceForm />}
                            // action={carLoader}
                        />
                        <Route path="user" element={<UserPage />} />
                        <Route
                            path="/"
                            element={<Navigate to="cars/" replace />}
                        />
                        <Route
                            path="services/add/"
                            element={<AddServiceForm />}
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
