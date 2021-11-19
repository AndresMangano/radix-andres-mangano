import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers"

export type CustomerDTO = {
    customerId: number;
    name: string;
}

export function createCustomer(body: {
    name: string;
}) {
    return httpPost<number>('/customers', body);
}

export function updateCustomer(customerId: number, body: {
    name: string;
}) {
    return httpPut(`/customers/${customerId}`, body);
}

export function deleteCustomer(customerId: number) {
    return httpDelete(`/customers/${customerId}`);
}

export function getCustomers() {
    return httpGet<CustomerDTO[]>('/customers');
}

export function getCustomer(customerId: number) {
    return httpGet<CustomerDTO>(`/customers/${customerId}`);
}