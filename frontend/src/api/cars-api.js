import axios from 'axios';

export const CarAPI = {
    carsLoader: async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/v1/cars/'
            );
            const cars = response.data.results;
            return cars;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    carLoader: async ({ params }) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/v1/cars/${params.carId}`
            );
            const car = response.data;
            return car;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};
