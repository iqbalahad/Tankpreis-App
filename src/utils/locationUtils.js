import * as Location from 'expo-location';

// Funktion, um Standortberechtigungen anzufordern und den aktuellen Standort abzurufen
export const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Standortberechtigung verweigert');
        return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    };
};
