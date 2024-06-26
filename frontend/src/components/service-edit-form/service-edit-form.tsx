// @ts-nocheck
import React, { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';
import { useParams, useLoaderData } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Typography, Upload, Image } from 'antd';
import type { FormProps, UploadFile } from 'antd';
import { useAuth } from '../../context/auth-provider';
import { CarAPI } from '../../api/cars-api';
import { Preloader } from '../../components/preloader/preloader';
import {
    CurrentService,
    FieldType,
    Photos,
    Rents,
    Service,
} from './service-edit-form-types';

const { Title } = Typography;

const { TextArea } = Input;

// const normFile = (e: any) => {
//     if (Array.isArray(e)) {
//         return e;
//     }
//     return e?.fileList;
// };

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);

export const EditServiceForm: React.FC = () => {
    // const { currentService } = useLoaderData<CurrentService>();
    const { token } = useAuth();
    const [form] = Form.useForm();
    const { serviceId } = useParams();

    const [currentService, setCurrentService] = useState<CurrentService>();
    const [services, setServices] = useState<Service[]>(() => []);
    const [rents, setRents] = useState<Rents[]>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const changePhotos = (photos: Photos[]) => {
        // const newPhotos = photos.map((photo) => {return photo.photo});
        if (photos) {
            return photos.map((photo) => {
                return { url: photo.photo };
            });
        }
    };

    useEffect(() => {
        const fetchServicesData = async () => {
            const currentService = await CarAPI.getService(serviceId);
            const services = await CarAPI.getAllServices();
            const rents = await CarAPI.rentsLoader();
            const photos = changePhotos(currentService?.photos);
            setRents(rents);
            setServices(services);
            setCurrentService(currentService);
            setFileList(photos);
        };
        fetchServicesData();
    }, [token]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // TODO падает cors при отправке запроса за изображением
        values.images = fileList;
        const photos = await Promise.all(
            values.images.map((item) => {
                if (item?.thumbUrl) {
                    return { photo: item.thumbUrl };
                }
                // const getBase64 = (file) => {
                //     const reader = new FileReader();
                //     reader.readAsDataURL(file);
                //     reader.onload = function () {
                //         setCurrentFile(reader.result);
                //         onChange(reader.result);
                //     };
                //     reader.onerror = function (error) {
                //         console.log('Error: ', error);
                //     };
                // };
                // return new Promise(async (resolve, reject) => {
                //     try {
                //         // Fetch на изображении с использованием axios
                //         const response = await axios.get(item.url, {
                //             headers: {
                //                 Authorization: `Bearer ${token}`,
                //             },
                //             responseType: 'blob', // Указываем, что ожидаем получить Blob
                //         });

                //         // Превращаем это в Blob
                //         const blob = new Blob([response.data]);

                //         // Читаем Blob, как если бы это был File
                //         const reader = new FileReader();
                //         reader.onloadend = () => {
                //             const base64ImageString = reader.result as string;
                //             resolve({ photo: base64ImageString });
                //         };
                //         reader.onerror = reject;
                //         reader.readAsDataURL(blob);
                //     } catch (e) {
                //         reject('Не удалось обработать URL файла. ' + e.message);
                //     }
                // });
            })
        );
        const data = {
            car: values.carLicensePlate,
            service: values.serviceName,
            comment: values.comment,
            photos,
        };
        CarAPI.editService(currentService.id, data);
        console.log('Success:', values);
        setFileList([]);
    };

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
        return <Preloader />;
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({
        fileList: newFileList,
    }: {
        fileList: UploadFile[];
    }) => {
        setFileList(newFileList);
        form.setFieldsValue({
            images: newFileList.map((file) => file.originFileObj),
        });
    };

    return (
        <>
            <Title>Изменение сервиса {currentService.id}</Title>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ maxWidth: 600 }}
                initialValues={{
                    carLicensePlate: currentService.car_license_plate,
                    serviceName: currentService.service,
                    serviceCommen: currentService.comment,
                    images: changePhotos(currentService?.photos),
                }}
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
                <Form.Item label="Upload" name="images" noStyle>
                    {/* TODO необходимо обработать ошибку по добавлению более пяти фото */}
                    <div>
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) =>
                                        setPreviewOpen(visible),
                                    afterOpenChange: (visible) =>
                                        !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </div>
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
