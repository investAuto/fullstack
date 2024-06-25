import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserAPI } from '../../api/user-api';

type FieldType = {
    fullname?: string;
    phone?: string;
    password?: string;
};

// const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
//     console.log('Success:', values);
// };

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const RegisterPage: React.FC = () => {
    let navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        UserAPI.register(values.fullname, values.phone, values.password);
        console.log('Success:', values);
        navigate(-1);
    };

    return (
        <Flex justify="center" align="center">
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h1>Регистрация </h1>
                <Form.Item<FieldType>
                    label="Fullname"
                    name="fullname"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста введите имя!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста введите номер телефона!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста введите пароль!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                {/* <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
        >
            <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
};
