import { useEffect, useState } from 'react';
import { Button, Card, Flex, Image, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import { CarAPI } from '../../api/cars-api';
import { Preloader } from '../preloader/preloader';
import { Rents as RentsType } from './rents-types';
const { Text, Title } = Typography;

const cardStyle: React.CSSProperties = {
    overflow: 'hidden',
    marginBottom: '10px',
    color: 'red',
    width: 620,
    height: 200,
};

const imgStyle: React.CSSProperties = {
    display: 'block',
    width: 273,
};

export const Rents = () => {
    const [rents, setRents] = useState<RentsType[]>([]);

    useEffect(() => {
        const fetchRentData = async () => {
            const rents = await CarAPI.rentsLoader();
            setRents(rents);
        };
        fetchRentData();
    }, []);

    if (!rents) {
        return <Preloader />;
    }
    return (
        <div>
            {rents.length ? <Title level={3}>Аренды</Title> : <></>}
            {rents.map((rent) => (
                <NavLink to={`/cars/${rent.car_id}`} key={rent.car_id}>
                    <Card
                        hoverable
                        style={cardStyle}
                        styles={{
                            body: { padding: 0, overflow: 'hidden' },
                        }}
                    >
                        <Flex justify="space-between">
                            <Image
                                style={imgStyle}
                                preview={false}
                                src={
                                    rent.car_photo ||
                                    'https://a.d-cd.net/8d95f9as-480.jpg'
                                }
                            />
                            <Flex
                                vertical
                                align="flex-end"
                                justify="space-between"
                                style={{ padding: 32 }}
                            >
                                <Title level={3}>{rent.car_name}</Title>
                                <Text>{rent.start_rent.toLocaleString()}</Text>
                                {new Date() > new Date(rent.end_rent) ? (
                                    <Text type="danger">
                                        {rent.end_rent.toLocaleString()}
                                    </Text>
                                ) : (
                                    <Text underline>
                                        {rent.end_rent.toLocaleString()}
                                    </Text>
                                )}

                                <Button type="primary" target="_blank">
                                    Оплатить
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </NavLink>
            ))}
        </div>
    );
};
