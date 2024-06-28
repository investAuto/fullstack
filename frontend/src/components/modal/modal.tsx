// @ts-nocheck
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { OrangeButton } from '../buttons/orange-button';
import { ApplicationForm } from '../application-form/application-form';

export interface IApplicationModalProps {
    carName: string;
    title: string;
}

export const ApplicationModal: React.FC = ({
    carName,
    title,
}: IApplicationModalProps) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');

    const showModal: (value: boolean) => void = () => {
        setOpen(true);
    };

    const handleOk = () => {
        // setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>
            <OrangeButton
                title="Подать заявку на аренду"
                handleClick={showModal}
            />
            <Modal
                title={title}
                open={open}
                onOk={handleOk}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                <ApplicationForm
                    closeModal={() => setOpen(false)}
                    carName={carName}
                />
            </Modal>
        </>
    );
};
