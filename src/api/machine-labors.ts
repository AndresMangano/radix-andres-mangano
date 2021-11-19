import { httpDelete, httpGet, httpPost } from "../helpers/http.helpers";

export type MachineLaborDTO = {
    machineLaborId: number;
    machine: {
        machineId: number;
        description: string;
    };
    labor: {
        laborId: number;
        description: string;
    };
    usage: number;
};

export function createMachineLabor(body: {
    machineId: number;
    laborId: number;
    usage: number;
}) {
    return httpPost<number>('/machine-labors', body);
}

export function deleteMachineLabor(machineLaborId: number) {
    return httpDelete(`/machine-labors/${machineLaborId}`);
}

export function getMachineLabors(query: {
    machineId?: number;
    laborId?: number;
}) {
    return httpGet<MachineLaborDTO[]>('/machine-labors', query);
}