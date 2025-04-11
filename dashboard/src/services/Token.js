import { useEffect, useState } from "react";
import { API } from "./API";

export default function DataRequest() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            const response = await API.get('/token');
            setAccessToken(response?.data);
        }
        getToken();
    }, [])

    return { accessToken };
}
