import type { Person } from '@domain/person/person.type';

export namespace Involvement {
    export type Type = 'whistleblower' | 'witness' | 'victim' | 'denounced';

    export type Model = {
        id: number;
        record_id: number;
        person_id: number;
        type: Type;
        person: Person.Model | null;
        created_at: string;
        updated_at: string | null;
        deleted_at: string | null;
    };
}
