import { httpGet, httpPost } from "../helpers/http.helpers";

export type AccountDistributionDTO = {
    accountDistributionId: number;
    account: {
        accountId: number;
        description: string;
    };
    costPool: {
        costPoolId: number;
        description: string;
    };
    percent: number;
};

export function updateAccountDistribution(body: {
    accountId: number;
    costPoolId: number;
    percent: number;
}) {
    return httpPost<number>(`/account-distributions`, body);
}

export function getAccountDistributions(query: {
    accountId?: number;
    costPoolId?: number;
}) {
    return httpGet<AccountDistributionDTO[]>(`/account-distributions`, query)
}