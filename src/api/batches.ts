import { httpDelete, httpGet, httpPost } from "../helpers/http.helpers"

export type BatchDTO = {
    batchId: number;
    date: Date;
    materialMachine: {
        materialMachineId: number;
        machine: {
            machineId: number;
            description: string;
        }
        material: {
            materialId: number;
            description: string;
        }
    }
    quantity: number;
    unitOfMeasureKV: {
        key: number;
        value: string;
    };
}

export function createBatch(body: {
    date: Date,
    materialMachineId: number;
    quantity: number;
    unitOfMeasure: number;
}) {
    return httpPost<number>('/batches', body);
}

export function deleteBatch(batchId: number) {
    return httpDelete(`/batches/${batchId}`);
}

export function getBatches() {
    return httpGet<BatchDTO[]>('/batches');
}

export function getBatch(batchId: number) {
    return httpGet<BatchDTO>(`/batches/${batchId}`);
}