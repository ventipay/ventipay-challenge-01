import { useState, useEffect } from 'react'

/**
 * returns the data from the API using the url
 * @param {string} url 
 * @returns 
 */
function useApiPayments(url, methodChosen) {
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(url, { method: methodChosen });
            const json = await response.json();
            setData(json.data);
            console.log(json.data);
        };
        fetchData();
        const intervalApi = setInterval(fetchData, 30000);
        return () => clearInterval(intervalApi);

    }, [url, methodChosen]);
    return { data };
}

export default useApiPayments