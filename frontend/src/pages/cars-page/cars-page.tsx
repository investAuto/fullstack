// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Flex, Card } from 'antd';
import {
    NavLink,
    useLoaderData,
    useSearchParams,
    useNavigate,
    useParams,
    useLocation,
} from 'react-router-dom';
import { Preloader } from '../../components/preloader/preloader';
import { Pagination } from 'antd';
import { CarAPI } from '../../api/cars-api';

const { Meta } = Card;

export const ListOfCars = () => {
    // const [page, setPage] = useSearchParams({ page: 1 });
    const location = useLocation();
    // const { page } = useParams();
    const carsData = useLoaderData();
    // const [carsData, setCarsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`/cars?page=${page}`);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await CarAPI.carsLoader({
    //                 params: { page: currentPage },
    //             });
    //             setCarsData(data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     fetchData();
    //     console.log('Загружены данные для страницы:', currentPage);
    // }, [currentPage]);

    if (!carsData) {
        return <Preloader />;
    }

    return (
        <Flex
            justify="space-around"
            align="center"
            wrap
            gap="small"
            className={navigation.state === 'loading' ? 'loading' : ''}
        >
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={carsData.count}
            />
            {carsData.results.map((car) => (
                <NavLink to={`${car.id}/`} key={car.id}>
                    <Card
                        hoverable
                        style={{
                            minWidth: '33%',
                            width: '100%',
                        }}
                        cover={
                            <img
                                alt="example"
                                src={
                                    car.photo ||
                                    'https://a.d-cd.net/8d95f9as-480.jpg'
                                }
                            />
                        }
                    >
                        <Meta
                            title={car.name}
                            description={car.short_description}
                        />
                    </Card>
                </NavLink>
            ))}
        </Flex>
    );
};

export default ListOfCars;
