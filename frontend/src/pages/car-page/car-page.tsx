// @ts-nocheck
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { TinyColor } from '@ctrl/tinycolor';
import { Preloader } from '../../components/preloader/preloader';
import {
    Button,
    ConfigProvider,
    Carousel,
    Image,
    Typography,
    Divider,
} from 'antd';
import styles from './car-page.module.less';

const { Text } = Typography;

const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];

const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

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
                </div>
            )}

            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            colorPrimary: `linear-gradient(135deg, ${colors2.join(', ')})`,
                            colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors2).join(', ')})`,
                            colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors2).join(', ')})`,
                            lineWidth: 0,
                        },
                    },
                }}
            >
                <Button type="primary" size="large" style={{ width: '100%' }}>
                    Подать заявку
                </Button>
            </ConfigProvider>
        </>
    );
};
