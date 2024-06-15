import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Flex, Image, Typography } from 'antd';
import { NavLink, useLoaderData } from 'react-router-dom';
import { Rents } from '../../components/rents/rents';
import { useAuth } from '../../context/auth-provider';
import { ServicesImageList } from '../../components/images/service-image-list';

const { Text, Title } = Typography;

const API_URL = 'http://127.0.0.1:8000/api/v1/';

interface Photos {
    id: number;
    photo: string;
}

export interface Services {
    author: number;
    car: string;
    date_service?: Date;
    id: number;
    photos?: Photos[];
    service: string;
    comment: string;
}

const cardStyle: React.CSSProperties = {
    overflow: 'hidden',
    marginBottom: '10px',
    color: 'red',
    width: 620,
    // height: 200,
};

const imgStyle: React.CSSProperties = {
    display: 'block',
    height: 100,
    maxWidth: 200,
};

export const UserPage = () => {
    const { token } = useAuth();
    const [services, setServices] = useState<Services[]>([]);
    // const rents = useLoaderData();
    useEffect(() => {
        axios
            .get(API_URL + 'services/')
            .then((response) => {
                return setServices(response.data);
            })
            .catch((error) => {
                console.error(error.message);
                console.log(error.response.data);
                // в error.response.data обычно содержится текст ошибки
                console.log(error.response.status);
                console.log(error.response.headers);
            });
    }, [token]);
    return (
        <>
            <Title>Это страница пользователя</Title>;
            <Rents />
            <div>
                {/* // TODO Вынести блок с арендами в отдельный компонент */}
                <Title level={3}>Сервисы</Title>

                {services.map((service) => (
                    // <NavLink to={`/cars/${rent.car_id}/`} key={rent.car_id}>
                    <Card
                        key={service.id}
                        hoverable
                        style={cardStyle}
                        styles={{
                            body: { padding: 0, overflow: 'hidden' },
                        }}
                    >
                        <Flex justify="space-between" vertical>
                            {service.photos ? (
                                <ServicesImageList photoData={service.photos} />
                            ) : (
                                <div style={{ height: '100px' }}>
                                    <h1>Привет</h1>
                                    <img
                                        // height={100}
                                        // style={imgStyle}
                                        src="https://a.d-cd.net/8d95f9as-480.jpg"
                                    />
                                </div>
                            )}
                            <Flex
                                vertical
                                align="flex-end"
                                justify="space-between"
                                style={{ padding: 32 }}
                            >
                                <Title level={3}>{service.service}</Title>
                                <Text>
                                    {service.date_service
                                        ? service.date_service.toLocaleString()
                                        : 'ожидается'}
                                </Text>
                                <Text underline>{service.id}</Text>
                                <Text>{service.comment}</Text>

                                {/* <Button
                                    type="primary"
                                    // href="https://ant.design"
                                    target="_blank"
                                >
                                    Get Started
                                </Button> */}
                            </Flex>
                        </Flex>
                    </Card>
                    // </NavLink>
                ))}
                {/* <Card title="Card title">Card content</Card> */}
            </div>
        </>
    );
};
