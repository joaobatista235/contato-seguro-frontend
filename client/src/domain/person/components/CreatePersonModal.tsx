import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';

import { createPerson } from '../api/create-person.service';
import { usePeopleContext } from '../People.context';
import { PersonFields, type Values } from './PersonFields';

export function CreatePersonModal() {
    const [isSending, setIsSending] = useState(false);

    const { setIsCreateModalVisible, fetchPeople } = usePeopleContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => setIsCreateModalVisible(false);

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await createPerson({
            ...values,
            birth_date: values.birth_date.format('YYYY-MM-DD'),
        });

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response, error =>
                error.statusCode === 409 ? 'Este CPF já está cadastrado.' : null
            );

        close();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Cadastrar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Cadastrar"
            onCancel={close}
            closable={!isSending}
            maskClosable={!isSending}
            keyboard={!isSending}
            cancelButtonProps={{ disabled: isSending }}
            cancelText="Cancelar"
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="createPerson"
                layout="vertical"
                autoComplete="off"
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}
