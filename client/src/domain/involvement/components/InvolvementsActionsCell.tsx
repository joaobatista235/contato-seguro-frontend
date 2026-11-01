import { useState } from 'react';

import { App, Button, Popconfirm } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';

import { deleteInvolvement } from '../api/delete-involvement.service';
import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';

type Props = { involvement: Involvement.Model; disabled: boolean };

export function InvolvementsActionsCell({ involvement, disabled }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const { recordId, isSending, setIsSending, fetchInvolvements } = useInvolvementsContext();
    const app = App.useApp();

    const handleDelete = async () => {
        if (disabled || isSending) return;

        setIsRemoving(true);
        setIsSending(true);

        try {
            const response = await deleteInvolvement(recordId, involvement.id);

            if (hasServiceError(response))
                return handleServiceError(app, response);

            setIsPopconfirmVisible(false);
            await fetchInvolvements();
        } finally {
            setIsRemoving(false);
            setIsSending(false);
        }
    };

    return (
        <Popconfirm
            title="Remover envolvido"
            description="Tem certeza que deseja remover esta pessoa do relato?"
            open={isPopconfirmVisible}
            placement="left"
            cancelText="Não"
            okText="Sim"
            okType="danger"
            okButtonProps={{ loading: isRemoving, disabled: disabled || (isSending && !isRemoving) }}
            cancelButtonProps={{ disabled: isRemoving }}
            onConfirm={handleDelete}
            onCancel={() => { if (!isRemoving) setIsPopconfirmVisible(false); }}
        >
            <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Remover envolvido"
                aria-label={`Remover ${involvement.person?.name ?? 'pessoa indisponível'} do relato`}
                disabled={disabled || isSending}
                onClick={() => setIsPopconfirmVisible(true)}
            />
        </Popconfirm>
    );
}
