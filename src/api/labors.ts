import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers";

export type LaborDTO = {
    laborId: number;
    description: string;
};

export function createLabor(body: {
    description: string;
}) {
    return httpPost<number>('/labors', body);
}

export function updateLabor(laborId: number, body: {
    description: string;
}) {
    return httpPut(`/labors/${laborId}`, body);
}

export function deleteLabor(laborId: number) {
    return httpDelete(`/labors/${laborId}`);
}

export function getLabors() {
    return httpGet<LaborDTO[]>('/labors');
}

export function getLabor(laborId: number) {
    return httpGet<LaborDTO>(`/labors/${laborId}`);
}