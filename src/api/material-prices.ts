import { httpDelete, httpGet, httpPost } from "../helpers/http.helpers";

export type MaterialPriceDTO = {
    materialPriceId: string;
    material: {
        materialId: number;
        description: string;
    }
    validFrom: Date;
    base: number;
    unitOfMeasureKV: {
        key: number;
        value: string;
    }
    price: number;
    currencyKV: {
        key: number;
        value: string;
    };
};

export function createMaterialPrice(body: {
    materialId: number;
    validFrom: Date;
    base: number;
    unitOfMeasure: number;
    price: number;
    currency: number;
}) {
    return httpPost<number>('/material-prices', body);
}

export function deleteMaterialPrice(materialPriceId: number) {
    return httpDelete(`/material-prices/${materialPriceId}`);
}

export function getMaterialPrices(query: {
    materialId?: number;
}) {
    return httpGet<MaterialPriceDTO[]>('/material-prices', query);
}