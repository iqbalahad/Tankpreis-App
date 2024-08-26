import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StationList from '../components/StationList';
import { getFavorites } from '../utils/favoriteUtils';

const FavoritenScreen = () => {
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleRefresh = async () => {
        await fetchFavorites();
    };

    const favoriteStations = favorites.map(station => ({
        ...station,
        price: 'No price available',
        status: 'No status available'
    }));

    return (
        <View style={styles.container}>
            <StationList
                stations={favoriteStations}
                refreshing={false}
                onRefresh={handleRefresh}
                showDetails={false} // Only show name and address
                centerAlign={true} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#012A32',
    },
});

export default FavoritenScreen;
