import { httpDelete, httpGet, httpPost } from "../helpers/http.helpers"

export type MaterialComponentDTO = {
    materialComponentId: number;
    material: {
        materialId: number;
        description: string;
    };
    component: {
        materialId: number;
        description: string;
    };
    quantity: number;
    unitOfMeasureKV: {
        key: number;
        value: string;
    };
}

export function createMaterialComponent(body: {
    materialId: number;
    componentMaterialId: number;
    quantity: number;
    unitOfMeasure: number;
}) {
    return httpPost<number>('/material-components', body);
}

export function deleteMaterialComponent(materialComponentId: number) {
    return httpDelete(`/material-components/${materialComponentId}`);
}

export function getMaterialComponents(query: {
    materialId?: number;
    componentId?: number;
}) {
    return httpGet<MaterialComponentDTO[]>('/material-components', query);
}