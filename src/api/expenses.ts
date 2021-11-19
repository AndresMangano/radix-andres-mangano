import { httpDelete, httpGet, httpPost } from "../helpers/http.helpers"

export type ExpenseDTO = {
    expenseId: number;
    account: {
        accountId: number;
        description: string;
    };
    date: Date;
    description: string;
    amount: number;
}

export function createExpense(body: {
    accountId: number;
    date: Date;
    description: string;
    amount: number;
}) {
    return httpPost<number>('/expenses', body);
}

export function deleteExpense(expenseId: number) {
    return httpDelete(`/expenses/${expenseId}`);
}

export function getExpenses() {
    return httpGet<ExpenseDTO[]>('/expenses');
}

export function getExpense(expenseId: number) {
    return httpGet<ExpenseDTO>(`/expenses/${expenseId}`);
}