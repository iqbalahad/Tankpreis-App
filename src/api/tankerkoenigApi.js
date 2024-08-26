import axios from "axios";

const API_KEY = "00000000-0000-0000-0000-000000000002";

export const getStationsByPostCode = async (lat, lng, radius, filterOpen, sort, type) => {
    try {
        const response = await axios.get(
            'https://creativecommons.tankerkoenig.de/json/list.php',
            {
                params: {
                    lat: lat,
                    lng: lng,
                    rad: radius,
                    sort: sort,
                    type: type,
                    isOpen: filterOpen,
                    apikey: API_KEY
                }
            }
        );

        console.log(response.data);

        if (response.data.ok) {
            return response.data;

        } else {
            console.error("API Error Message:", response.data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
        return [];
    }
};



export const getStationDetailsByID = async (stationId) => {
    try {
        const { data: details } = await axios.get(
            'https://creativecommons.tankerkoenig.de/json/detail.php',
            {
                params: {
                    id: stationId,
                    apikey: API_KEY,
                },
            }
        );

        console.log(details);

        if (details.ok) {
            return details.station;
        } else {
            console.error('API Error Message:', details.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching station details: ', error);
        return null;
    }
};
