import { Fragment } from 'react';

import { DatePicker, Form, Input } from 'antd';

import type { Dayjs } from 'dayjs';

export type Values = {
    name: string;
    cpf: string;
    email: string;
    birth_date: Dayjs;
};

export function PersonFields() {
    return (
        <Fragment>
            <Form.Item<Values>
                name="name"
                label="Nome completo"
                rules={[{ required: true, whitespace: true, message: 'Por favor, digite o nome completo.' }]}
            >
                <Input placeholder="Nome completo da pessoa" />
            </Form.Item>

            <Form.Item<Values>
                name="cpf"
                label="CPF"
                rules={[
                    { required: true, message: 'Por favor, digite um CPF.' },
                    { len: 11, message: 'O CPF deve ter 11 dígitos.' },
                    { pattern: /^\d{11}$/, message: 'O CPF deve conter apenas números.' },
                ]}
            >
                <Input placeholder="Somente números, sem pontuação" maxLength={11} inputMode="numeric" />
            </Form.Item>

            <Form.Item<Values>
                name="email"
                label="E-mail"
                rules={[
                    { required: true, message: 'Por favor, digite um e-mail.' },
                    { type: 'email', message: 'Por favor, digite um e-mail válido.' },
                ]}
            >
                <Input placeholder="E-mail de contato" />
            </Form.Item>

            <Form.Item<Values>
                name="birth_date"
                label="Data de nascimento"
                rules={[{ required: true, message: 'Por favor, informe a data de nascimento.' }]}
            >
                <DatePicker format="DD/MM/YYYY" placeholder="Selecione a data de nascimento" style={{ width: '100%' }} />
            </Form.Item>
        </Fragment>
    );
}
