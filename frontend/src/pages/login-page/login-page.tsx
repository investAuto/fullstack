import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { redirect, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { UserAPI } from '../../api/user-api';
import { useAuth } from '../../context/auth-provider';

type FieldType = {
    phone?: string;
    password?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    UserAPI.login(values.phone, values.password);
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const LoginPage: React.FC = () => {
    const { token, setToken } = useAuth();
    let navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const data = await UserAPI.login(values.phone, values.password);
        setToken(data.access);
        console.log('Success:', values);
    };

    useEffect(() => {
        if (token) {
            navigate('/user/', { replace: true });
        }
    }, [token, setToken]);
    // const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    //     // setToken('this is a test token');
    //     UserAPI.login(values.phone, values.password);
    //     console.log('Success:', values);
    //     return navigate('/user');
    // };

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
                <h1>Авторизация</h1>
                <Form.Item<FieldType>
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please input your phone!' },
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
                            message: 'Please input your password!',
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
