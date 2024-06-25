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
                RESPONSE_MESSAGE.error('Ошибка регистрации');
                console.error(error.message);
                console.log(error.response.data);
                // в error.response.data обычно содержится текст ошибки
                console.log(error.response.status);
                console.log(error.response.headers);
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
                    // TODO Здесь нужно наверно добавлять данные пользователя если это необходимо или добавлять их в стате
                    localStorage.setItem('phone', phone);
                }

                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                // в error.response.data обычно содержится текст ошибки
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    getCurrentUser: () => {
        return axios
            .get(API_URL + 'users/me/')
            .then((response) => {
                // if (response.data.access) {
                //     localStorage.setItem('token', response.data.access);
                //     localStorage.setItem('phone', phone);
                // }

                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                // в error.response.data обычно содержится текст ошибки
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    getCurrentUserPhone: () => {
        return JSON.parse(localStorage.getItem('phone'));
    },
};
