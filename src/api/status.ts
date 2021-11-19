import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || '';

export function useSystemVersion() {
    const [version, setVersion] = useState<string>('');
    useEffect(() => {
        axios.get<string>(`${API_URL}/status`)
            .then(res => setVersion(res.data))
            .catch(_ => alert("No se pudo conectar con el servidor"));
    }, []);

    return version;
}