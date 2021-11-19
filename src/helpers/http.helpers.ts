import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || '';

export function getHeader() {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('radix.token' || '')}`
        }
    };
}

export async function httpGet<TResult>(route: string, params?: any) {
    try {
        return await axios.get<TResult>(`${API_URL}${route}`, { ...getHeader(), params })
            .then(res => res.data);
    }
    catch (err) {
        if (err.response.status === 500) {
            alert("Error en el servidor");
        }
        else {
            alert(err.response.data.Error);
        }

        throw err;
    }
}

export async function httpPost<TResult>(route: string, body: any) {
    try {
        return await axios.post<TResult>(`${API_URL}${route}`, body, getHeader())
            .then(res => res.data);
    }
    catch (err) {
        if (err.response.status === 500) {
            alert("Error en el servidor");
        }
        else {
            alert(err.response.data.Error);
        }

        throw err;
    }
}

export async function httpPut(route: string, body: any) {
    try {
        return await axios.put<void>(`${API_URL}${route}`, body, getHeader())
            .then(res => res.data);
    }
    catch (err) {
        if (err.response.status === 500) {
            alert("Error en el servidor");
        }
        else {
            alert(err.response.data.Error);
        }

        throw err;
    }
}

export async function httpDelete(route: string) {
        try {
            return await axios.delete<void>(`${API_URL}${route}`, getHeader())
                .then(res => res.data);
        }
        catch (err) {
            if (err.response.status === 500) {
                alert("Error en el servidor");
            }
            else {
                alert(err.response.data.Error);
            }

            throw err;
        }
}

export function useRefresh<TResult>(request: () => Promise<TResult>, dependency: any[]): [TResult | undefined, () => void] {
    const [result, setResult] = useState<TResult>();
    const refresh = useCallback(() => {
        request()
            .then(res => setResult(res));
    // eslint-disable-next-line
    }, dependency);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return [result, refresh];
}