import type { useAppProps } from 'antd/es/app/context';

import type { Service } from '@domain/@shared/service.type';

export type MakeMessage = (response: Service.ServerException) => string | null;

type AppNotification = {
    notification: Pick<useAppProps['notification'], 'error'>;
};

export function hasServiceError(response: Service.DefaultResponse | Service.ExceptionResponse): response is Service.ExceptionResponse {
    if (response instanceof Error)
        return true;

    if ('error' in response)
        return true;

    return false;
}

/** @warning Depends on React and Antd! */
export function handleServiceError({ notification }: AppNotification, response: Service.ExceptionResponse, makeMessage?: MakeMessage): void {
    console.log('%cA service error has been detected!', 'background-color: #871f1f; color: white');

    if (response instanceof Error)
        return notification.error({ message: 'Algo deu errado!', description: response.message });

    if (makeMessage !== undefined)
        return notification.error({ message: 'Algo deu errado!', description: makeMessage(response) ?? response.error.description });

    notification.error({ message: 'Algo deu errado!', description: response.error.description });
}
