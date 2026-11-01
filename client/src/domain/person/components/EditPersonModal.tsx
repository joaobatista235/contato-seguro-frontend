import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import dayjs from 'dayjs';

import { updatePerson } from '../api/update-person.service';
import { usePeopleContext } from '../People.context';
import { PersonFields, type Values } from './PersonFields';

export function EditPersonModal() {
    const [isSending, setIsSending] = useState(false);

    const {
        person,
        setIsEditModalVisible,
        setPersonId,
        fetchPeople,
    } = usePeopleContext();

    const app = App.useApp();

    const [form] = Form.useForm<Values>();

    if (!person) return null;

    const personId = person.id;

    const close = () => {
        setIsEditModalVisible(false);
        setPersonId(null);
    };

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await updatePerson(personId, {
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
            title="Editar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Confirmar"
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
                name="editPerson"
                layout="vertical"
                autoComplete="off"
                initialValues={{ ...person, birth_date: dayjs(person.birth_date) }}
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}
