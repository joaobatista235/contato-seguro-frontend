import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { App } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { UnknownContextError } from '@domain/@shared/unknown-context-error';
import { listPeople } from '@domain/person/api/list-people.service';
import type { Person } from '@domain/person/person.type';

import { listInvolvements } from './api/list-involvements.service';
import type { Involvement } from './involvement.type';

type Value = {
    recordId: number;
    involvements: Involvement.Model[];
    isAnonymous: boolean | null;
    isLoading: boolean;
    hasLoadError: boolean;
    people: Person.Model[];
    isPeopleLoading: boolean;
    hasPeopleError: boolean;
    isSending: boolean;
    setIsSending: Dispatch<SetStateAction<boolean>>;
    fetchInvolvements: () => Promise<void>;
    fetchPeople: () => Promise<void>;
};

type Props = {
    recordId: number;
    children: (value: Value) => ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const InvolvementsContext = createContext<Value | null>(null);

export function InvolvementsContextProvider({ recordId, children }: Props) {
    const [involvements, setInvolvements] = useState<Involvement.Model[]>([]);
    const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);
    const [people, setPeople] = useState<Person.Model[]>([]);
    const [isPeopleLoading, setIsPeopleLoading] = useState(true);
    const [hasPeopleError, setHasPeopleError] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const app = App.useApp();

    const fetchInvolvements = useCallback(async () => {
        setIsLoading(true);
        setHasLoadError(false);
        setIsAnonymous(null);

        const response = await listInvolvements(recordId);

        setIsLoading(false);

        if (hasServiceError(response)) {
            setHasLoadError(true);
            return handleServiceError(app, response);
        }

        setInvolvements(response.data.involvements);
        setIsAnonymous(response.data.is_anonymous);
    }, [app, recordId]);

    const fetchPeople = useCallback(async () => {
        setIsPeopleLoading(true);
        setHasPeopleError(false);

        const response = await listPeople();

        setIsPeopleLoading(false);

        if (hasServiceError(response)) {
            setHasPeopleError(true);
            return handleServiceError(app, response);
        }

        setPeople(response.data.people);
    }, [app]);

    useEffect(() => {
        fetchInvolvements();
        fetchPeople();
    }, [fetchInvolvements, fetchPeople]);

    const value: Value = {
        recordId,
        involvements,
        isAnonymous,
        isLoading,
        hasLoadError,
        people,
        isPeopleLoading,
        hasPeopleError,
        isSending,
        setIsSending,
        fetchInvolvements,
        fetchPeople,
    };

    return (
        <InvolvementsContext.Provider value={value}>
            {children(value)}
        </InvolvementsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInvolvementsContext() {
    const context = useContext(InvolvementsContext);

    if (!context)
        throw new UnknownContextError();

    return context;
}
