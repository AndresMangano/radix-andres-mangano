import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers"

export type CustomerPriceDTO = {
    customerPriceId: number;
    customer: {
        customerId: number;
        name: string;
    }
    material: {
        materialId: number;
        description: string;
    };
    code: string;
    price: number;
    lastApprovedPrice: number|null;
    salesTarget: number;
    unitOfMeasureKV: {
        key: number;
        value: string;
    };
}

export function createCustomerPrice(body: {
    customerId: number;
    materialId: number;
    code: string;
    price: number;
    salesTarget: number;
    unitOfMeasure: number;
}) {
    return httpPost<number>(`/customer-prices`, body);
}

export function updateCustomerPrice(customerPriceId: number, body: {
    price: number;
    salesTarget: number;
    unitOfMeasure: number;
}) {
    return httpPut(`/customer-prices/${customerPriceId}`, body);
}

export function deleteCustomerPrice(customerPriceId: number) {
    return httpDelete(`/customer-prices/${customerPriceId}`);
}

export function getCustomerPrices(query: {
    customerId?: number;
}) {
    return httpGet<CustomerPriceDTO[]>(`/customer-prices`, query);
}

export function getCustomerPrice(customerPriceId: number) {
    return httpGet<CustomerPriceDTO>(`/customer-prices/${customerPriceId}`);
}