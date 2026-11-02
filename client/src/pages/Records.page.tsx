import { Fragment } from 'react';

import { Button, Row, type TableColumnsType, Tag, Typography } from 'antd';

import { Show } from '@domain/@shared/Show';
import { Table } from '@domain/@shared/Table';
import { CompaniesContextProvider } from '@domain/company/Companies.context';
import type { Involvement } from '@domain/involvement/involvement.type';
import { InvolvementsContextProvider } from '@domain/involvement/Involvements.context';
import { CreateRecordModal } from '@domain/record/components/CreateRecordModal';
import { EditRecordModal } from '@domain/record/components/EditRecordModal';
import { RecordsActionsCell } from '@domain/record/components/RecordsActionsCell';
import type { Record } from '@domain/record/record.type';
import { RecordsContextProvider } from '@domain/record/Records.context';

const STATUS_LABELS: Record<Record.Status, string> = {
    awaiting_investigation: 'Aguardando investigação',
    investigation_in_progress: 'Investigação em andamento',
    resolved: 'Resolvido',
    archived: 'Arquivado',
};

function renderPeople(record: Record.ListItem, type: Involvement.Type) {
    if (!record.involvementSummary) return 'Indisponível';

    return record.involvementSummary.involvements
        .filter(involvement => involvement.type === type)
        .map(involvement => involvement.person?.name ?? 'Pessoa indisponível')
        .join(', ') || '-';
}

const COLUMNS: TableColumnsType<Record.ListItem> = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: value => `#${value}`,
    },
    {
        title: 'Título',
        dataIndex: 'title',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: value => STATUS_LABELS[value as Record.Status] ?? value,
    },
    {
        title: 'Identificação',
        render: (_, record) => {
            const summary = record.involvementSummary;

            if (!summary) return 'Indisponível';

            return (
                <Tag color={summary.is_anonymous ? 'default' : 'blue'}>
                    {summary.is_anonymous ? 'Anônimo' : 'Identificado'}
                </Tag>
            );
        },
    },
    { title: 'Relatantes', render: (_, record) => renderPeople(record, 'whistleblower') },
    { title: 'Testemunhas', render: (_, record) => renderPeople(record, 'witness') },
    { title: 'Vítimas', render: (_, record) => renderPeople(record, 'victim') },
    { title: 'Denunciados', render: (_, record) => renderPeople(record, 'denounced') },
    {
        render: (_, record) => <RecordsActionsCell record={record} />,
    },
];

export function Records() {
    return (
        <CompaniesContextProvider>
            {() => (
                <RecordsContextProvider>
                    {({
                        isLoading,
                        records,
                        record,
                        setIsCreateModalVisible,
                        isCreateModalVisible,
                        isEditModalVisible,
                    }) => (
                        <Fragment>
                            <main>
                                <Row justify="space-between" align="middle">
                                    <Typography.Title level={3}>
                                        Relatos
                                    </Typography.Title>

                                    <Button
                                        type="primary"
                                        onClick={() => setIsCreateModalVisible(true)}
                                    >
                                        Cadastrar
                                    </Button>
                                </Row>

                                <Table
                                    columns={COLUMNS}
                                    dataSource={records}
                                    loading={isLoading}
                                    scroll={{ x: 1400 }}
                                />
                            </main>

                            <Show when={isCreateModalVisible}>
                                <CreateRecordModal />
                            </Show>

                            <Show when={isEditModalVisible}>
                                {record && (
                                    <InvolvementsContextProvider key={record.id} recordId={record.id}>
                                        {() => <EditRecordModal />}
                                    </InvolvementsContextProvider>
                                )}
                            </Show>
                        </Fragment>
                    )}
                </RecordsContextProvider>
            )}
        </CompaniesContextProvider>
    );
}
