import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers"

export const DRIVER_MACHINE_HOURS = 1;

export type CostPoolDTO = {
    costPoolId: number;
    description: string;
    costDriverKV: {
        key: number;
        value: string;
    };
    machine: {
        machineId: number;
        description: string;
    }|null;
}

export function createCostPool(body: {
    description: string;
    costDriver: number;
    machineId?: number;
}) {
    return httpPost<number>('/cost-pools', body);
}

export function updateCostPool(costPoolId: number, body: {
    description: string;
}) {
    return httpPut(`/cost-pools/${costPoolId}`, body);
}

export function deleteCostPool(costPoolId: number) {
    return httpDelete(`/cost-pools/${costPoolId}`);
}

export function getCostPools(query: {
    machineId?: number;
}) {
    return httpGet<CostPoolDTO[]>(`/cost-pools`, query);
}

export function getCostPool(costPoolId: number) {
    return httpGet<CostPoolDTO>(`/cost-pools/${costPoolId}`);
}