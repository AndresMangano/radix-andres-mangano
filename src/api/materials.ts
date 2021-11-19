import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers"

export type MaterialDTO = {
    materialId: number;
    isActive: boolean;
    code: string;
    description: string;
    unitOfMeasureKV: {
        key: number;
        value: string;
    };
    defaultSupplyKV: {
        key: number;
        value: string;
    };
    isTreatment: boolean;
}

export function createMaterial(body: {
    code: string;
    description: string;
    unitOfMeasure: number;
    defaultSupply: number;
    isTreatment: boolean;
}) {
    return httpPost<number>('/materials', body);
}

export function updateMaterial(materialId: number, body: {
    code: string;
    description: string;
    defaultSupply: number;
    isTreatment: boolean;
}) {
    return httpPut(`/materials/${materialId}`, body);
}

export function deleteMaterial(materialId: number) {
    return httpDelete(`/materials/${materialId}`);
}

export function getMaterials() {
    return httpGet<MaterialDTO[]>('/materials');
}

export function getMaterial(materialId: number) {
    return httpGet<MaterialDTO>(`/materials/${materialId}`);
}