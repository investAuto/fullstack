import React, { useEffect, useState } from 'react';
import { Button, Card, Flex, Typography } from 'antd';
import { ServicesImageList } from '../../components/images/service-image-list';
import { EditOutlined } from '@ant-design/icons';
import { CarAPI } from '../../api/cars-api';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '../preloader/preloader';

const { Text, Title } = Typography;

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
};

export const Services = () => {
    const [services, setServices] = useState<Services[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRentData = async () => {
            const services = await CarAPI.servicesLoader();
            setServices(services);
        };
        fetchRentData();
    }, []);

    if (!services) {
        return <Preloader />;
    }

    return (
        <div>
            <Title level={3}>Сервисы</Title>

            {services.map((service) => (
                <Card
                    key={service.id}
                    hoverable
                    style={cardStyle}
                    styles={{
                        body: { padding: 0, overflow: 'hidden' },
                    }}
                >
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() =>
                            navigate(`/services/${service.id}/edit/`)
                        }
                    />
                    <Flex justify="space-between" vertical>
                        {service.photos ? (
                            <ServicesImageList photoData={service.photos} />
                        ) : (
                            <div style={{ height: '100px' }}>
                                <h1>Привет</h1>
                                <img src="https://a.d-cd.net/8d95f9as-480.jpg" />
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
                        </Flex>
                    </Flex>
                </Card>
            ))}
        </div>
    );
};
