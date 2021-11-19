import { useEffect, useState } from "react";
import { httpGet } from "../helpers/http.helpers";

export type CurrencyDTO = {
    key: number;
    value: string;
}

export function useCurrencies() {
    const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
    useEffect(() => {
        httpGet<CurrencyDTO[]>('/static/currencies')
        .then((res) => {
            setCurrencies(res)
        })
    }, [])
    return currencies;
}

export type QuantityUnitDTO = {
    key: number;
    value: string;
}
export function useQuantityUnits() {
    const [quantityUnits, setQuantityUnits] = useState<QuantityUnitDTO[]>([]);
    useEffect(() => {
        httpGet<QuantityUnitDTO[]>('/static/quantity-units')
        .then((res) => {
            setQuantityUnits(res)
        })
    }, [])
    return quantityUnits;
}

export type CostDriverDTO = {
    key: number;
    value: string;
}
export function useCostDrivers() {
    const [costDrivers, setCostDrivers] = useState<CostDriverDTO[]>([]);
    useEffect(() => {
        httpGet<CostDriverDTO[]>('/static/cost-drivers')
        .then((res) => {
            setCostDrivers(res)
        })
    }, [])
    return costDrivers
}

export type MaterialSupplyDTO = {
    key: number;
    value: string;
}

export function useMaterialSupplies(): MaterialSupplyDTO[] {
    return [
        { key: 1, value: 'INTERNO' },
        { key: 2, value: 'EXTERNO' }
    ];
}