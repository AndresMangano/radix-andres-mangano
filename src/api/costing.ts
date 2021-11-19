import { useEffect, useState } from "react";
import { httpGet } from "../helpers/http.helpers";

export type MaterialCostingDTO = {
    unitOfMeasure: {
        id: number;
        description: string;
    };
    directMaterialCosts: {
        material: {
            id: number;
            description: string;
        };
        quantity: number;
        unitOfMeasure: {
            id: number;
            description: string;
        };
        price: {
            validFrom: Date;
            unitPrice: number;
            currency: {
                id: number;
                description: string;
            };
        }
        isTreatment: boolean;
        cost: number;
    }[];
    directLaborCosts: {
        machine: {
            id: number;
            description: string;
        };
        labor: {
            id: number;
            description: string;
        };
        hours: number;
        hourlyRate: number;
        cost: number;
    }[];
    indirectCosts: {
        costPool: {
            id: number;
            description: string;
        };
        costDriver: {
            id: number;
            description: string;
        };
        unitUsage: number;
        usage: number;
        totalUsage: number;
        totalExpenses: number;
        driverCost: number;
        cost: number;
    }[];
};

export function useMaterialCosting(query: { materialId: number, start: Date, end: Date})
{
    const [materialCosting, setMaterialCosting] = useState<MaterialCostingDTO>();
    const startDate = query.start.toISOString();
    const endDate = query.end.toISOString();

    useEffect(() => {
        httpGet<MaterialCostingDTO>(`/costing/materials/${query.materialId}`, {
            start: startDate,
            end: endDate
        })
        .then(result => setMaterialCosting(result))
    }, [query.materialId, startDate, endDate]);

    return materialCosting;
}

export type CustomerMaterialPriceDTO = {
    code: string;
    material: {
        id: number;
        description: string;
    };
    salesTarget: number;
    rawMaterialCost: number;
    laborCost: number;
    treatmentsCost: number;
    generalExpenses: number;
    others: number;
    totalCost: number;
    unitOfMeasure: {
        id: number;
        description: string;
    };
    fm: number;
    lastApprovedPrice: number|null;
    price: number;
    increase: number;
    profit: number;
};

export function getCustomerMaterialPrices(customerId: number, query: {start: Date, end: Date}) {
    const startDate = query.start.toISOString();
    const endDate = query.end.toISOString();

    return httpGet<CustomerMaterialPriceDTO[]>(`/costing/customers/${customerId}/prices`, {
        start: startDate,
        end: endDate
    });
}