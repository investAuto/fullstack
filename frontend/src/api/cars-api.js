import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/';

export const CarAPI = {
    // carsLoader: async () => {
    //     try {
    //         const response = await axios.get(`${API_URL}cars/`);
    //         const carsData = response.data;
    //         return carsData;
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // },
    carsLoader: async ({ params = { page: 1 } } = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}cars?page=${params.page}`
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    carLoader: async ({ params }) => {
        try {
            const response = await axios.get(`${API_URL}cars/${params.carId}`);
            const car = response.data;
            return car;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    rentsLoader: async () => {
        return axios
            .get(API_URL + 'cars/my_rents/')
            .then((response) => {
                // rents = response.data;
                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    servicesLoader: async () => {
        return axios
            .get(API_URL + 'services/')
            .then((response) => {
                // rents = response.data;
                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    addService: async (data) => {
        return axios
            .post(API_URL + 'services/', data)
            .then((response) => {
                return console.log(response.data);
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    getAllServices: async () => {
        return axios
            .get(API_URL + 'services/get_services/')
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    getService: async (serviceId) => {
        return axios
            .get(`${API_URL}services/${serviceId}/`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
    editService: async (serviceId, data) => {
        return axios
            .patch(`${API_URL}services/${serviceId}/`, data)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    },
};
