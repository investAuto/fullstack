// @ts-nocheck
import React, { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';
import { useParams, useLoaderData } from 'react-router-dom';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Typography, Upload, Image } from 'antd';
import type { FormProps, UploadFile } from 'antd';
import { useAuth } from '../../context/auth-provider';
import { CarAPI } from '../../api/cars-api';
import {
    CurrentService,
    FieldType,
    Photos,
    Rents,
    Service,
} from './service-edit-form-types';

const { Title } = Typography;

const { TextArea } = Input;

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);

export const EditServiceForm: React.FC = () => {
    const { token } = useAuth();
    const [form] = Form.useForm();
    const { serviceId } = useParams();

    const [currentService, setCurrentService] = useState<CurrentService>();
    const [services, setServices] = useState<Service[]>(() => []);
    const [rents, setRents] = useState<Rents[]>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchServicesData = async () => {
            const currentService = await CarAPI.getService(serviceId);
            const services = await CarAPI.getAllServices();
            const rents = await CarAPI.rentsLoader();

            const photos = currentService?.photos.map((image, index) => ({
                uid: index,
                name: `image-${index}`,
                status: 'done',
                url: image.photo,
            }));

            setRents(rents);
            setServices(services);
            setCurrentService(currentService);
            setFileList(photos);
        };
        fetchServicesData();
    }, [token]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        /* Собираме данные формы и отправляем на сервер. */
        // TODO падает cors при отправке запроса за изображением
        const formData = new FormData();
        fileList.forEach((file) => {
            if (!file.url) {
                // Только новые файлы
                formData.append('images', file.originFileObj);
            }
        });
        const photos = [
            {
                photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
            },
            {
                photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
            },
        ];
        formData.append('car', values.carLicensePlate);
        formData.append('service', values.serviceName);
        formData.append('photos', photos);
        formData.append('comment', values.serviceCommen);

        // formData.append('car', values.carLicensePlate);

        CarAPI.editService(currentService.id, formData);
        console.log('Success:', values);
        setFileList([]);
    };
    const handleChange = ({ fileList }) => setFileList(fileList);
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
        errorInfo
    ) => {
        console.log('Failed:', errorInfo);
    };

    if (
        !services ||
        !services.length ||
        !rents ||
        !rents.length ||
        !currentService
    ) {
        return <h1>Подождите идёт загрузка....</h1>;
    }

    return (
        <>
            <Title>Изменение сервиса {currentService.id}</Title>
            <Form
                form={form}
                onFinish={onFinish}
                // labelCol={{ span: 4 }}
                // wrapperCol={{ span: 14 }}
                // layout="horizontal"
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                // style={{ maxWidth: 600 }}
                // initialValues={{
                //     carLicensePlate: currentService.car_license_plate,
                //     serviceName: currentService.service,
                //     serviceCommen: currentService.comment,
                //     images: changePhotos(currentService?.photos),
                // }}
            >
                <Form.Item
                    label="Номер автомобиля"
                    name="carLicensePlate"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста выберите автомобиль',
                        },
                    ]}
                >
                    <Select>
                        {rents &&
                            rents.map((rent) => (
                                <Select.Option
                                    value={rent.car_license_plate}
                                    key={rent.car_id}
                                >
                                    {rent.car_license_plate}
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Название сервиса"
                    name="serviceName"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста выберите название сервиса.',
                        },
                    ]}
                >
                    <Select>
                        {services &&
                            services.map((service) => (
                                <Select.Option
                                    value={service.name}
                                    key={service.id}
                                >
                                    {service.name}
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Комментарий" name="serviceCommen">
                    <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 8 }} />
                </Form.Item>
                <Form.Item name="images">
                    <Upload
                        fileList={fileList}
                        onChange={handleChange}
                        listType="picture"
                        multiple={true}
                    >
                        <Button icon={<UploadOutlined />}>Upload Images</Button>
                    </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Отправить
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
