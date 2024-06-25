// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Select,
    Typography,
    Upload,
    UploadProps,
    Image,
    UploadFile,
    FormProps,
} from 'antd';
import { Preloader } from '../../components/preloader/preloader';

import { useAuth } from '../../context/auth-provider';
import { CarAPI } from '../../api/cars-api';
import { FieldType, FileType, Rents, Service } from './service-add-form-types';

const { Title } = Typography;

const { TextArea } = Input;

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export const AddServiceForm: React.FC = () => {
    const { token } = useAuth();
    const [form] = Form.useForm();

    const [services, setServices] = useState<Service[]>(() => []);
    const [rents, setRents] = useState<Rents[]>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchServicesData = async () => {
            const services = await CarAPI.getAllServices();
            const rents = await CarAPI.rentsLoader();
            setRents(rents);
            setServices(services);
        };
        fetchServicesData();
    }, [token]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // const photos = await Promise.all(
        //     values.images.map((item) => {
        //         return new Promise((resolve, reject) => {
        //             const reader = new FileReader();
        //             reader.onloadend = () => {
        //                 const base64ImageString = reader.result as string;
        //                 item.thumbUrl = base64ImageString;
        //                 resolve({ photo: item.thumbUrl });
        //             };
        //             reader.onerror = reject;
        //             if (item) {
        //                 reader.readAsDataURL(item);
        //             } else {
        //                 reject('No origin file attached with the item.');
        //             }
        //         });
        //     })
        // );
        const data = {
            car: values.carLicensePlate,
            service: values.serviceName,
            comment: values.comment,
            photos,
        };
        CarAPI.addService(data);
        console.log('Success:', values);
        setFileList([]);
        form.resetFields();
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
        // TODO необходимо обработать ошибки здесь
        errorInfo
    ) => {
        console.log('Failed:', errorInfo);
    };

    if (!services || !services.length || !rents || !rents.length) {
        return <Preloader />;
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const customRequest = ({ file, onSuccess }) => {
        getBase64(file).then((base64) => {
            fetch('http://127.0.0.1:8000/api/v1/services/upload_photo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    photo: base64,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    onSuccess(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    };
    const beforeUpload = (file) => {
        console.log('file', file);
    };

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
            <Title>Добавление сервиса</Title>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ maxWidth: 600 }}
                initialValues={{
                    carLicensePlate: rents[0].car_license_plate,
                    serviceName: services[0].name,
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
                <Form.Item label="Комментарий" name="comment">
                    <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 8 }} />
                </Form.Item>
                <Form.Item
                    label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    {/* TODO необходимо обработать ошибку по добавлению более пяти фото */}
                    <div>
                        <Upload
                            listType="picture-card"
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                        >
                            <button
                                style={{ border: 0, background: 'none' }}
                                type="button"
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
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
