// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Flex, Card } from 'antd';
import axios from 'axios';
import { NavLink, Link, useLoaderData } from 'react-router-dom';

const { Meta } = Card;

export const ListOfCars = () => {
    const cars = useLoaderData();
    return (
        <Flex justify="space-around" align="center" wrap gap="small">
            {cars.map((car) => (
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
                        // cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
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
