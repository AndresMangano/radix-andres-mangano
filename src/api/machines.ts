import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers";

export type MachineDTO = {
    machineId: number;
    isActive: boolean;
    description: string;
};

export function createMachine(body: {
    description: string;
}) {
    return httpPost<number>('/machines', body);
}

export function updateMachine(machineId: number, body: {
    description: string;
}) {
    return httpPut(`/machines/${machineId}`, body);
}

export function deleteMachine(machineId: number) {
    return httpDelete(`/machines/${machineId}`);
}

export function getMachines() {
    return httpGet<MachineDTO[]>('/machines');
}

export function getMachine(machineId: number) {
    return httpGet<MachineDTO>(`/machines/${machineId}`);
}