import { useState } from 'react';

import { App, Button, Popconfirm, Space } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';

import { deletePerson } from '../api/delete-person.service';
import { usePeopleContext } from '../People.context';
import type { Person } from '../person.type';

type Props = { person: Person.Model };

export function PeopleActionsCell({ person }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const { setPersonId, setIsEditModalVisible, fetchPeople } = usePeopleContext();

    const app = App.useApp();

    const handleEdit = () => {
        setPersonId(person.id);
        setIsEditModalVisible(true);
    };

    const handleDelete = async () => {
        setIsSending(true);

        const response = await deletePerson(person.id);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setIsPopconfirmVisible(false);
        fetchPeople();
    };

    return (
        <Space size="middle">
            <Button
                type="text"
                icon={<EditOutlined />}
                title="Editar"
                aria-label={`Editar ${person.name}`}
                onClick={handleEdit}
            />

            <Popconfirm
                title="Excluir pessoa"
                description="Tem certeza que deseja excluir a pessoa?"
                open={isPopconfirmVisible}
                placement="left"
                cancelText="Não"
                okText="Sim"
                okType="danger"
                okButtonProps={{ loading: isSending }}
                onConfirm={handleDelete}
                onCancel={() => { if (!isSending) setIsPopconfirmVisible(false); }}
                cancelButtonProps={{ disabled: isSending }}
            >
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    title="Excluir"
                    aria-label={`Excluir ${person.name}`}
                    onClick={() => setIsPopconfirmVisible(true)}
                />
            </Popconfirm>
        </Space>
    );
}
