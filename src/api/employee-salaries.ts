import { httpDelete, httpGet, httpPost } from "../helpers/http.helpers"

export type EmployeeSalaryDTO = {
    employeeSalaryId: number;
    employee: {
        employeeId: number;
        name: string;
    };
    validFrom: Date;
    hourlyRate: number;
}

export function createEmployeeSalary(body: {
    employeeId: number;
    validFrom: Date;
    hourlyRate: number;
}) {
    return httpPost<number>('/employee-salaries', body);
}

export function deleteEmployeeSalary(employeeSalaryId: number) {
    return httpDelete(`/employee-salaries/${employeeSalaryId}`);
}

export function getEmployeeSalaries(query: {
    employeeId?: number;
}) {
    return httpGet<EmployeeSalaryDTO[]>('/employee-salaries', query);
}