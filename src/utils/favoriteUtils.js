import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_STATIONS';

export const getFavorites = async () => {
    try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error fetching favorites', error);
        return [];
    }
};

export const addFavorite = async (station) => {
    try {
        const favorites = await getFavorites();
        const updatedFavorites = [...favorites, station];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
        console.error('Error adding favorite', error);
    }
};

export const removeFavorite = async (stationId) => {
    try {
        const favorites = await getFavorites();
        const updatedFavorites = favorites.filter(fav => fav.id !== stationId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
        console.error('Error removing favorite', error);
    }
};

export const isFavorite = async (stationId) => {
    try {
        const favorites = await getFavorites();
        return favorites.some(fav => fav.id === stationId);
    } catch (error) {
        console.error('Error checking favorite', error);
        return false;
    }
};
