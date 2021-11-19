import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers";

export type AccountDTO = {
    accountId: number;
    isActive: boolean;
    description: string;
};

export function createAccount(body: {
    description: string;
}) {
    return httpPost<number>(`/accounts`, body);
}

export function updateAccount(accountId: number, body: {
    description: string;
}) {
    return httpPut(`/accounts/${accountId}`, body);
}

export function deleteAccount(accountId: number) {
    return httpDelete(`/accounts/${accountId}`);
}

export function getAccounts() {
    return httpGet<AccountDTO[]>('/accounts');
}

export function getAccount(accountId: number) {
    return httpGet<AccountDTO>(`/accounts/${accountId}`);
}