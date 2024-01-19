import axios, { AxiosResponse } from 'axios';
import { getAuthKey } from '@/shared/utils/cookies';

export function* getService(endpoint: string, queryParams?: any) {
    const authKey: string = `Bearer ${getAuthKey()}`;

    const { data }: AxiosResponse = yield axios.get(endpoint, {
        headers: {
            Authorization: authKey,
            queryParams
        }
    });

    return data;
}

export function* postService(endpoint: string, body?: any) {
    const authKey: string = `Bearer ${getAuthKey()}`;

    const { data }: AxiosResponse = yield axios.post(endpoint, {
        headers: {
            Authorization: authKey,
        },
        body,
    });

    return data;
}

export function* putService(endpoint: string, body: any) {
    const authKey: string = `Bearer ${getAuthKey()}`;

    const { data }: AxiosResponse = yield axios.put(endpoint, body, {
        headers: {
            Authorization: authKey,
        },
    });

    return data;
}

export function* patchService(endpoint: string, body: any) {
    const authKey: string = `Bearer ${getAuthKey()}`;

    const { data }: AxiosResponse = yield axios.patch(endpoint, body, {
        headers: {
            Authorization: authKey,
        }
    });

    return data;
}

export function* deleteService(endpoint: string) {
    const authKey: string = `Bearer ${getAuthKey()}`;

    const { data }: AxiosResponse = yield axios.delete(endpoint, {
        headers: {
            Authorization: authKey,
        },
    });

    return data;
}
