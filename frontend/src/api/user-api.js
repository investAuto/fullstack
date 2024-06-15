import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/';

export const UserAPI = {
    register: (fullname, phone, password) => {
        return axios
            .post(API_URL + 'users/', {
                fullname,
                phone,
                password,
            })
            .then((response) => {
                if (response.data) {
                    let ddd = response.data;
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
    login: (phone, password) => {
        return axios
            .post(API_URL + 'auth/jwt/create/', {
                phone,
                password,
            })
            .then((response) => {
                if (response.data.access) {
                    localStorage.setItem('token', response.data.access);
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
    getCurrentUserPhone: () => {
        return JSON.parse(localStorage.getItem('phone'));
    },
};
