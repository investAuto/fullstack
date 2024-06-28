// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Select,
    Typography,
    Upload,
    Image,
    message,
} from 'antd';
import type { FormProps, UploadFile, UploadProps } from 'antd';
import { CarAPI } from '../../api/cars-api';
import { Preloader } from '../../components/preloader/preloader';
import {
    CurrentService,
    FieldType,
    Photo,
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

const RESPONSE_MESSAGE = message;
RESPONSE_MESSAGE.config({
    top: 70,
});

export const EditServiceForm: React.FC = () => {
    const [form] = Form.useForm();
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [currentService, setCurrentService] = useState<CurrentService>();
    const [services, setServices] = useState<Service[]>([]);
    const [rents, setRents] = useState<Rents[]>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [removeList, setRemoveList] = useState<number[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const changePhotos = (photos: Photo[]) => {
        if (photos) {
            return photos.map((photo) => {
                return { id: photo.id, url: photo.photo };
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
    }, [serviceId]);

    const photos = [];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // const formData = new FormData();
        // formData.append('car', values.carLicensePlate);
        // formData.append('service', values.serviceName);
        // formData.append('comment', values.serviceCommen);

        for (const file of fileList) {
            if (file.originFileObj) {
                const base64 = await getBase64(file.originFileObj);
                photos.push({ photo: base64 });
            }
        }
        const data = {
            car: values.carLicensePlate,
            service: values.serviceName,
            comment: values.serviceCommen,
            photos: photos,
            remove_photos_ids: removeList,
        };
        CarAPI.editService(currentService.id, data);
        setFileList([]);
        navigate('/user/');
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
        errorInfo
    ) => {
        return errorInfo;
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

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleRemove = (file) => {
        setRemoveList([file.id, ...removeList]);
        setFileList((prevList) =>
            prevList.filter((item) => item.uid !== file.uid)
        );
    };

    const handleChange: UploadProps['onChange'] = ({
        fileList: newFileList,
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
                form={form}
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
                        {rents.map((rent) => (
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
                        {services.map((service) => (
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
                    <div>
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={handleRemove}
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
