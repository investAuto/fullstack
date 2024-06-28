import axios from 'axios';
import { message } from 'antd';

const API_URL = 'http://127.0.0.1:8000/api/v1/';

const RESPONSE_MESSAGE = message;
RESPONSE_MESSAGE.config({
    top: 70,
});

export const CarAPI = {
    carsLoader: async ({ params = { page: 1 } } = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}cars?page=${params.page}`
            );
            return response.data;
        } catch (error) {
            RESPONSE_MESSAGE.error(error.message);
        }
    },
    carLoader: async ({ params }) => {
        try {
            const response = await axios.get(`${API_URL}cars/${params.carId}`);
            const car = response.data;
            return car;
        } catch (error) {
            RESPONSE_MESSAGE.error(error.message);
        }
    },
    rentsLoader: async () => {
        return axios
            .get(API_URL + 'cars/my_rents/')
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
    servicesLoader: async () => {
        return axios
            .get(API_URL + 'services/')
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
    addService: async (data) => {
        return axios
            .post(API_URL + 'services/', data)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
    getAllServices: async () => {
        return axios
            .get(API_URL + 'services/get_services/')
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
    getService: async (serviceId) => {
        return axios
            .get(`${API_URL}services/${serviceId}/`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
    editService: async (serviceId, data) => {
        return axios
            .patch(`${API_URL}services/${serviceId}/`, data)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
    sendApplication: async (carId, data) => {
        return axios
            .post(`${API_URL}cars/${carId}/send_application/`, data)
            .then((response) => {
                RESPONSE_MESSAGE.success('Сообщение отправлено!');
                return response.data;
            })
            .catch((error) => {
                RESPONSE_MESSAGE.error(error.message);
            });
    },
};
