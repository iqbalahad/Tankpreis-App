import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { getStationsByPostCode } from '../api/tankerkoenigApi';
import { getLocation } from '../utils/locationUtils';
import StationList from '../components/StationList';

const HomeScreen = ({ route }) => {
    const [stations, setStations] = useState([]);
    const [fuelType, setFuelType] = useState('e5');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const filters = route.params.filters;
            let lat;
            let lon;
            if (filters.suchMethode === 'aktueller Standort') {
                const location = await getLocation();
                lat = location.latitude;
                lon = location.longitude;
            } else {
                const coords = filters.coords;
                lat = coords.lat;
                lon = coords.lon;
            }

            const radius = filters.suchRadius;
            const open = filters.filter;
            const maxErgbnis = filters.maxErgebnisse;
            const sort = filters.sortiereNach;

            const result = await getStationsByPostCode(lat, lon, radius, open, sort, fuelType, maxErgbnis);
            setStations(result.stations.length > maxErgbnis ? result.stations.slice(0, maxErgbnis) : result.stations);
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (route.params?.filters) {
            const filters = route.params.filters;
            setFuelType(filters.spritart);
            fetchData();
        }
    }, [route.params?.filters]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const filters = route.params?.filters || {};

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.filtersContainer}>
                <Text style={styles.filterText}>{fuelType}</Text>
                <Text style={styles.filterText}>{filters.suchMethode === 'aktueller Standort' ? 'Aktueller Standort' : filters.suchMethode}</Text>
                <Text style={styles.filterText}>{filters.suchRadius} km</Text>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>Lade Tankstellen...</Text>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {stations.length > 0 ? (
                        <StationList
                            stations={stations}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            showDetails={true} // Alle Details anzeigen
                        />
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noData}>Keine Tankstellen gefunden.</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: "#012A32",
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#028097',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#01ABCB',
    },
    filterText: {
        fontSize: 14,
        marginHorizontal: 5,
        color: "#fff"
    },
    contentContainer: {
        flex: 1,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noData: {
        fontSize: 16,
        color: 'white',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'white',
    },
});

export default HomeScreen;
