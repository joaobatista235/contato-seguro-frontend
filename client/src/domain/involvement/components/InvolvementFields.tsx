import { Fragment } from 'react';

import { Form, Select } from 'antd';

import { INVOLVEMENT_TYPE_LABELS } from '../involvement.constants';
import type { Involvement } from '../involvement.type';
import { useInvolvementsContext } from '../Involvements.context';

export type Values = Pick<Involvement.Model, 'person_id' | 'type'>;

const TYPE_OPTIONS = Object.entries(INVOLVEMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export function InvolvementFields() {
    const { people, involvements, isPeopleLoading } = useInvolvementsContext();

    return (
        <Fragment>
            <Form.Item<Values>
                name="person_id"
                label="Pessoa"
                rules={[{ required: true, message: 'Por favor, selecione uma pessoa.' }]}
            >
                <Select
                    placeholder="Selecione uma pessoa cadastrada"
                    showSearch
                    loading={isPeopleLoading}
                    options={people.map(person => ({
                        label: `${person.name} (${person.cpf})`,
                        value: person.id,
                        disabled: involvements.some(involvement => involvement.person_id === person.id),
                    }))}
                    filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent="Nenhuma pessoa encontrada"
                />
            </Form.Item>

            <Form.Item<Values>
                name="type"
                label="Tipo de envolvimento"
                rules={[{ required: true, message: 'Por favor, selecione o tipo de envolvimento.' }]}
            >
                <Select options={TYPE_OPTIONS} placeholder="Selecione o tipo de envolvimento" />
            </Form.Item>
        </Fragment>
    );
}
