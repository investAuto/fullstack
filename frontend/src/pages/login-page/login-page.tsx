// @ts-nocheck
import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Form, Input, message } from 'antd';
import { UserAPI } from '../../api/user-api';
import { useAuth } from '../../context/hook_use_auth';

type FieldType = {
    phone?: string;
    password?: string;
    remember?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    // TODO Нужно ли мне onFinishFailed или нет
    return errorInfo;
};

export const LoginPage: React.FC = () => {
    const { token, setToken } = useAuth();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const RESPONSE_MESSAGE = message;
    RESPONSE_MESSAGE.config({
        top: 70,
    });

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const data = await UserAPI.login(values.phone, values.password);
        {
            data?.access && setToken(data.access);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/user/', { replace: true });
        }
    }, [navigate, token, setToken]);

    return (
        <Flex justify="center" align="center">
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h1>Авторизация</h1>
                <Form.Item<FieldType>
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Введите номер!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Введите пароль!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
};
