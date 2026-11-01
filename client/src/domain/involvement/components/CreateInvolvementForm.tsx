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

    const onFinish = async (values: Values) => {
        if (disabled || isSending) return;

        setIsSending(true);
        setIsCreating(true);

        try {
            const response = await createInvolvement(recordId, values);

            if (hasServiceError(response)) {
                handleServiceError(app, response, error => {
                    if (error.statusCode === 409)
                        return 'Esta pessoa já está envolvida neste relato.';

                    if (error.statusCode === 404)
                        return 'A pessoa ou o relato não está mais disponível. Atualize os dados e tente novamente.';

                    if (error.statusCode >= 500)
                        return 'Não foi possível adicionar esta pessoa ao relato. Tente novamente mais tarde.';

                    return null;
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
            disabled={disabled || isSending}
        >
            <InvolvementFields />

            <Button type="primary" htmlType="submit" loading={isCreating} disabled={disabled || isSending}>
                Adicionar envolvido
            </Button>
        </Form>
    );
}
