import { httpDelete, httpGet, httpPost, httpPut } from "../helpers/http.helpers"

export type EmployeeDTO = {
    employeeId: number;
    labor: {
        laborId: number;
        description: string;
    }
    name: string;
}

export function createEmployee(body: {
    name: string;
    laborId: number;
}) {
    return httpPost<number>('/employees', body);
}

export function updateEmployee(employeeId: number, body: {
    name: string;
    laborId: number;
}) {
    return httpPut(`/employees/${employeeId}`, body);
}

export function deleteEmployee(employeeId: number) {
    return httpDelete(`/employees/${employeeId}`);
}

export function getEmployees(query: {
    laborId?: number;
}) {
    return httpGet<EmployeeDTO[]>('/employees', query);
}

export function getEmployee(employeeId: number) {
    return httpGet<EmployeeDTO>(`/employees/${employeeId}`);
}