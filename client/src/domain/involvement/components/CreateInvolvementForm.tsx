import { useState } from 'react';

import { App, Button, Form } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';

import { createInvolvement } from '../api/create-involvement.service';
import { useInvolvementsContext } from '../Involvements.context';
import { InvolvementFields, type Values } from './InvolvementFields';

type Props = { disabled: boolean };

export function CreateInvolvementForm({ disabled }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const { recordId, isSending, setIsSending, fetchInvolvements } = useInvolvementsContext();
    const [form] = Form.useForm<Values>();
    const app = App.useApp();

    const isDisabled = disabled || isSending;

    const onFinish = async (values: Values) => {
        if (isDisabled) return;

        setIsSending(true);
        setIsCreating(true);

        const errorMsg: Partial<Record<number, string>> = {
            409: 'Esta pessoa já está envolvida neste relato.',
            404: 'A pessoa ou o relato não está mais disponível. Atualize os dados e tente novamente.',
            500: 'Não foi possível adicionar esta pessoa ao relato. Tente novamente mais tarde.',
        };

        try {
            const response = await createInvolvement(recordId, values);

            if (hasServiceError(response)) {
                handleServiceError(app, response, error => {
                    const errorCode = error.statusCode >= 500 ? 500 : error.statusCode;

                    return errorMsg[errorCode] ?? null;
                });

                if (!(response instanceof Error) && response.statusCode === 409) {
                    form.resetFields(['person_id']);
                    await fetchInvolvements();
                }

                return;
            }

            form.resetFields();
            await fetchInvolvements();
        } finally {
            setIsCreating(false);
            setIsSending(false);
        }
    };

    return (
        <Form
            form={form}
            name="createInvolvement"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            disabled={isDisabled}
        >
            <InvolvementFields />

            <Button type="primary" htmlType="submit" loading={isCreating} disabled={isDisabled}>
                Adicionar envolvido
            </Button>
        </Form>
    );
}
