import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers"

export type MaterialMachineDTO = {
    materialMachineId: number;
    material: {
        materialId: number;
        description: string;
    };
    hourlyRate: number;
    machine: {
        machineId: number;
        description: string;
    };
    unitOfMeasureKV: {
        key: number;
        value: string;
    };
}

export function createMaterialMachine(body: {
    materialId: number;
    machineId: number;
    hourlyRate: number;
    unitOfMeasure: number;
}) {
    return httpPost<number>('/material-machines', body);
}

export function updateMaterialMachine(materialMachineId: number, body: {
    hourlyRate: number;
    unitOfMeasure: number;
}) {
    return httpPut(`/material-machines/${materialMachineId}`, body);
}

export function deleteMaterialMachine(materialMachineId: number) {
    return httpDelete(`/material-machines/${materialMachineId}`);
}

export function getMaterialMachines(query: {
    materialId?: number;
    machineId?: number;
}) {
    return httpGet<MaterialMachineDTO[]>('/material-machines', query);
}

export function getMaterialMachine(materialMachineId: number) {
    return httpGet<MaterialMachineDTO>(`/material-machines/${materialMachineId}`);
}