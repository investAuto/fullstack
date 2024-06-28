import axios from 'axios';
import { message } from 'antd';

const API_URL = 'http://127.0.0.1:8000/api/v1/';

const RESPONSE_MESSAGE = message;
RESPONSE_MESSAGE.config({
    top: 70,
});

export const UserAPI = {
    register: (fullname, phone, password) => {
        return axios
            .post(API_URL + 'users/', {
                fullname,
                phone,
                password,
            })
            .then((response) => {
                RESPONSE_MESSAGE.success('Регистрация прошла успешно!');
                return response.data;
            })
            .catch((error) => {
                if (error.response.data.phone) {
                    RESPONSE_MESSAGE.error(error.response.data.phone);
                } else if (error.response.data.fullname) {
                    RESPONSE_MESSAGE.error(error.response.data.fullname);
                } else if (error.response.data.password) {
                    RESPONSE_MESSAGE.error(error.response.data.password);
                } else {
                    RESPONSE_MESSAGE.error('Ошибка регистрации');
                }
            });
    },
    login: (phone, password) => {
        return axios
            .post(API_URL + 'auth/jwt/create/', {
                phone,
                password,
            })
            .then((response) => {
                if (response.data.access) {
                    localStorage.setItem('token', response.data.access);
                }

                return response.data;
            })
            .catch(() => {
                RESPONSE_MESSAGE.error('Неверный логин или пароль!');
            });
    },
    getCurrentUser: () => {
        return axios
            .get(API_URL + 'users/me/')
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
};
