// @ts-nocheck
import React, { useEffect } from 'react';
import { ApplicationModal } from '../../components/modal/modal';
import { useLoaderData } from 'react-router-dom';
import { Preloader } from '../../components/preloader/preloader';
import { Carousel, Image, Typography, Divider } from 'antd';
import styles from './car-page.module.less';

const { Text } = Typography;

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '160px',
    maxHeight: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

export const CarPage = () => {
    const car = useLoaderData();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!car) {
        return <Preloader />;
    }

    return (
        <>
            {car && (
                <div>
                    <Carousel
                        arrows
                        infinite={false}
                        dots={{ className: styles.myDotsClass }}
                    >
                        {car.photos.map((photo, i) => (
                            <div key={i} style={contentStyle}>
                                <Image
                                    src={photo.photo}
                                    alt={car.name}
                                    width={'100%'}
                                />
                            </div>
                        ))}
                        {car.videos?.map((video, i) => (
                            <div key={i} style={contentStyle}>
                                <Image
                                    src={video.video}
                                    alt={car.name}
                                    width={'100%'}
                                />
                            </div>
                        ))}
                    </Carousel>
                    <Divider />
                    <div>
                        <Text strong>Марка авто: </Text>
                        <Text>{car.name}</Text>
                    </div>
                    <div>
                        <Text strong>Описание: </Text>
                        <Text>{car.description}</Text>
                    </div>
                    <div>
                        <Text strong>Цена: </Text>
                        <Text>{car.price} ₽</Text>
                    </div>
                    <div>
                        <Text strong>Аренда в день: </Text>
                        <Text>{car.daily_rent} ₽</Text>
                    </div>
                    <Divider />
                    <ApplicationModal
                        title="Заявка на аренду"
                        carName={car.name}
                    />
                </div>
            )}
        </>
    );
};
