// @ts-nocheck
import { useState, useEffect } from 'react';
import { Flex, Card } from 'antd';
import { NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import { Preloader } from '../../components/preloader/preloader';
import { Pagination } from 'antd';
import { CarAPI } from '../../api/cars-api';

const { Meta } = Card;

export const ListOfCars = () => {
    const [carsData, setCarsData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const page = searchParams.get('page')
            ? parseInt(searchParams.get('page'))
            : 1;
        setCurrentPage(page);
    }, [searchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`/cars?page=${page}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            // TODO Нужно подумать как менять последнюю страницу,
            // TODO если мы удаляем карточки и пагинация должна быть уменьшена
            // if (carsData?.count < 11) {
            //     setCurrentPage(1);
            // }
            // TODO может быть убрать отсюда try catch
            try {
                const data = await CarAPI.carsLoader({
                    params: { page: currentPage },
                });
                setCarsData(data);
            } catch (error) {
                return error;
            }
        };
        fetchData();
    }, [currentPage]);

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
            {carsData.count > 10 && (
                <Flex
                    justify="center"
                    style={{ marginTop: '16px', width: '100%' }}
                >
                    <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        total={carsData.count}
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default ListOfCars;
