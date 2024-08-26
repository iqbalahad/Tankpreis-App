import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favoriteUtils';
import { getStationDetailsByID } from '../api/tankerkoenigApi';
import { useNavigation } from '@react-navigation/native';

const StationList = ({ stations, refreshing, onRefresh, showDetails = true, centerAlign = false }) => {
    const navigation = useNavigation()
    const actionSheetRef = React.useRef(null);
    const [selectedStation, setSelectedStation] = React.useState(null);
    const [isFav, setIsFav] = React.useState(false);

    const handlePress = async (station) => {
        const favorite = await isFavorite(station.id);
        setIsFav(favorite);
        setSelectedStation(station);
        actionSheetRef.current?.show();
    };

    const handleActionPress = async (index) => {
        if (index === 0) {
            try {
                const details = await getStationDetailsByID(selectedStation.id);
                console.log("Station Details:", details);
                navigation.navigate('Details', { details });

            } catch (error) {
                console.error("Fehler beim Abrufen der Details:", error);
            }
        } else if (index === 1) {
            if (isFav) {
                removeFavorite(selectedStation.id);
            } else {
                addFavorite(selectedStation);
            }
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
            <View style={[styles.row, centerAlign && styles.centeredRow]}>
                {showDetails ? (
                    <>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>{item.price ? `${item.price} €/l` : 'No price'}</Text>
                        </View>
                        <View style={[styles.detailsContainer, centerAlign && styles.centeredDetails]}>
                            <Text style={styles.stationName}>{item.name}</Text>
                            <Text style={styles.address}>{item.street} {item.houseNumber}</Text>
                            <Text style={styles.status}>{item.status}</Text>
                        </View>
                        <View style={styles.distContainer}>
                            <Text style={styles.dist}>{item.dist} km</Text>
                        </View>
                    </>
                ) : (
                    <View style={[styles.detailsContainer, centerAlign && styles.centeredDetails]}>
                        <Text style={styles.stationName}>{item.name}</Text>
                        <Text style={styles.address}>{item.street} {item.houseNumber} </Text>
                        <Text style={styles.address}>{item.postCode} {item.place} </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <FlatList
                data={stations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.flatListContent}
            />
            <ActionSheet
                ref={actionSheetRef}
                options={['Details ansehen', isFav ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen', 'Abbrechen']}
                cancelButtonIndex={2}
                onPress={(index) => handleActionPress(index)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#012A32',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
    },
    centeredRow: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        flex: 2,
        marginRight: 15,
        justifyContent: 'center',
    },
    centeredDetails: {
        alignItems: 'center',
    },
    priceContainer: {
        flex: 0,
        alignItems: 'flex-end',
        marginRight: 20,
        justifyContent: 'center',
    },
    distContainer: {
        flex: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    dist: {
        fontSize: 16,
        color: '#fff',
    },
    stationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    address: {
        fontSize: 14,
        color: '#fff',
    },
    status: {
        fontSize: 14,
        color: '#fff',
        fontStyle: 'italic',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
    },
    flatListContent: {
        paddingBottom: 20,
    },

});

export default StationList;
