import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';
import { useCompaniesContext } from '@domain/company/Companies.context';
import { RecordInvolvements } from '@domain/involvement/components/RecordInvolvements';
import { useInvolvementsContext } from '@domain/involvement/Involvements.context';

import { updateRecord } from '../api/update-record.service';
import { useRecordsContext } from '../Records.context';
import { RecordFields, type Values } from './RecordFields';

export function EditRecordModal() {
    const [isSending, setIsSending] = useState(false);

    const {
        record,
        setIsEditModalVisible,
        setRecordId,
        fetchRecords,
    } = useRecordsContext();

    const { companies } = useCompaniesContext();
    const { isSending: isSendingInvolvement } = useInvolvementsContext();

    const app = App.useApp();

    const [form] = Form.useForm<Values>();

    if (!record) return null;

    const currentRecordId = record.id;

    const close = () => {
        if (isSending || isSendingInvolvement) return;

        setIsEditModalVisible(false);
        setRecordId(null);
        fetchRecords();
    };

    const onFinish = async (values: Values) => {
        if (isSending || isSendingInvolvement) return;

        setIsSending(true);

        const response = await updateRecord(currentRecordId, values);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setIsEditModalVisible(false);
        setRecordId(null);
        fetchRecords();
    };

    return (
        <Modal
            open
            title="Editar relato"
            width={720}
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Salvar relato"
            okButtonProps={{ disabled: isSendingInvolvement }}
            onCancel={close}
            cancelText="Fechar"
            cancelButtonProps={{ disabled: isSending || isSendingInvolvement }}
            closable={!isSending && !isSendingInvolvement}
            keyboard={!isSending && !isSendingInvolvement}
            maskClosable={!isSending && !isSendingInvolvement}
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="editRecord"
                layout="vertical"
                autoComplete="off"
                initialValues={record}
                disabled={isSending || isSendingInvolvement}
            >
                <RecordFields companies={companies} />
            </Form>

            <Divider />

            <RecordInvolvements disabled={isSending} />
        </Modal>
    );
}
