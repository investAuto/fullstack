import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';
import { CarAPI } from '../../api/cars-api';

type FieldType = {
    name?: string;
    carName?: string;
    phone?: string;
};

export interface IApplicationFormProps {
    closeModal: () => void;
    carName: string;
}

export const ApplicationForm: React.FC<IApplicationFormProps> = ({
    carName,
    closeModal,
}) => {
    // Форма для отправки заявки на аренду или покупку
    const [form] = Form.useForm();
    const { carId } = useParams();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // TODO отпрвить сообщение на почту
        // TODO Тут нужно вывести сообщение что форма отправлена и очистить форму
        // TODO ещё нужно обработать валидацию номера телефона и название тоже можно
        await CarAPI.sendApplication(carId, values);
        closeModal();
        form.resetFields();
    };
    //     r'^((\+7|7|8)+([0-9]){10})$',
    //     'Номер должен начинаться с 7, +7, 8'
    //     ' и содержать после этого 10 цифр.'
    // )]
    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ carName: carName }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType> label="Имя" name="name">
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Телефон"
                name="phone"
                rules={[
                    { required: true, message: 'Пожалуйста введите номер' },
                    {
                        pattern: /^(?:\+7|8)?\d{10}$/,
                        message:
                            'Пожалуйста, введите корректный номер телефона',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Название автомобиля"
                name="carName"
                rules={[
                    { required: true, message: 'Введите название автомобиля' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};
