import { Alert, Button, Row, Space, type TableColumnsType, Tag, Typography } from 'antd';

import { Table } from '@domain/@shared/Table';

import { INVOLVEMENT_TYPE_LABELS } from '../involvement.constants';
import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';
import { CreateInvolvementForm } from './CreateInvolvementForm';
import { InvolvementsActionsCell } from './InvolvementsActionsCell';

type Props = { disabled: boolean };

export function RecordInvolvements({ disabled }: Props) {
    const {
        involvements,
        isAnonymous,
        isLoading,
        hasLoadError,
        people,
        isPeopleLoading,
        hasPeopleError,
        isSending,
        fetchInvolvements,
        fetchPeople,
    } = useInvolvementsContext();

    const columns: TableColumnsType<Involvement.Model> = [
        {
            title: 'Nome',
            render: (_, involvement) => involvement.person?.name ?? 'Pessoa indisponível',
        },
        {
            title: 'CPF',
            render: (_, involvement) => involvement.person?.cpf ?? '—',
        },
        {
            title: 'Envolvimento',
            dataIndex: 'type',
            render: (type: Involvement.Type) => INVOLVEMENT_TYPE_LABELS[type],
        },
        {
            render: (_, involvement) => (
                <InvolvementsActionsCell involvement={involvement} disabled={disabled || isLoading || hasLoadError} />
            ),
        },
    ];

    const isFormDisabled = disabled || isLoading || hasLoadError || isPeopleLoading || hasPeopleError || people.length === 0;

    return (
        <section aria-label="Envolvidos no relato">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row justify="space-between" align="middle">
                    <Typography.Title level={5} style={{ margin: 0 }}>Envolvidos</Typography.Title>

                    {isAnonymous !== null && (
                        <Tag color={isAnonymous ? 'default' : 'blue'}>
                            {isAnonymous ? 'Anônimo' : 'Identificado'}
                        </Tag>
                    )}
                </Row>

                <Typography.Text type="secondary">
                    O relato é anônimo quando não possui um envolvido do tipo relatante.
                </Typography.Text>

                {hasLoadError ? (
                    <Alert
                        type="error"
                        showIcon
                        message="Não foi possível carregar os envolvidos e o anonimato do relato."
                        action={<Button onClick={fetchInvolvements} disabled={disabled || isSending}>Tentar novamente</Button>}
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={involvements}
                        loading={isLoading}
                        size="small"
                        scroll={{ x: 560 }}
                    />
                )}

                {hasPeopleError ? (
                    <Alert
                        type="error"
                        showIcon
                        message="Não foi possível carregar as pessoas cadastradas."
                        action={<Button onClick={fetchPeople} disabled={disabled || isSending}>Tentar novamente</Button>}
                    />
                ) : !isPeopleLoading && people.length === 0 ? (
                    <Alert type="info" showIcon message="Cadastre uma pessoa na tela de Pessoas para adicionar envolvidos." />
                ) : null}

                <Typography.Text type="secondary">
                    Os vínculos são salvos ao adicionar ou remover envolvidos. Fechar esta janela não desfaz essas alterações.
                </Typography.Text>
                <CreateInvolvementForm disabled={isFormDisabled} />
            </Space>
        </section>
    );
}
