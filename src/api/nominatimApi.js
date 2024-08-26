import axios from "axios";

export const getCoordinates = async (postalCode) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                postalcode: postalCode,
                countrycodes: 'DE',
                format: 'json',
                addressdetails: 1
            }
        });
        const results = response.data;
        if (results.length > 0) {
            const location = results[0];
            return {
                lat: location.lat,
                lon: location.lon
            };
        } else {
            throw new Error('Keine Ergebnisse gefunden');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Koordinaten:', error);
        throw error;
    }
};