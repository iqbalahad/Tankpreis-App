// src/screens/FilterScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocation } from '../utils/locationUtils';
import { getCoordinates } from '../api/nominatimApi';

const FilterScreen = () => {
    const navigation = useNavigation();
    const route = useRoute(); 

    const { applyFilters } = route.params || {}; 

    const [suchMethode, setSuchMethode] = useState('aktueller Standort');
    const [suchRadius, setSuchRadius] = useState('5 km');
    const [spritart, setSpritart] = useState('Super E5');
    const [filter, setFilter] = useState('Alle');
    const [maxErgebnisse, setMaxErgebnisse] = useState('50');
    const [sortiereNach, setSortiereNach] = useState('Entfernung');
    const [coords, setCoords] = useState("");

    const [isSuchMethodeModalVisible, setSuchMethodeModalVisible] = useState(false);
    const [isSuchRadiusModalVisible, setSuchRadiusModalVisible] = useState(false);
    const [isSpritartModalVisible, setSpritartModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [isMaxErgebnisseModalVisible, setMaxErgebnisseModalVisible] = useState(false);
    const [isSortiereNachModalVisible, setSortiereNachModalVisible] = useState(false);

    const [selectedOption, setSelectedOption] = useState('aktueller Standort');
    const [plz, setPlz] = useState('');
    const [plzError, setPlzError] = useState('');
    const [locationError, setLocationError] = useState('');

    const openModal = (setModalVisible) => {
        
        if (setModalVisible === setSuchMethodeModalVisible) {
            setSelectedOption(suchMethode === 'aktueller Standort' ? 'aktueller Standort' : 'PLZ');
        }
        setModalVisible(true);
    };

    const closeModal = (setModalVisible) => setModalVisible(false);

    const applySuchMethodeSelection = async () => {
        if (selectedOption === 'aktueller Standort') {
            try {
                const location = await getLocation();
                if (location) {
                    setSuchMethode("aktueller Standort");
                    setPlzError('');
                    setLocationError('');
                    closeModal(setSuchMethodeModalVisible);
                } else {
                    setLocationError('Standortzugriff verweigert. Bitte aktivieren Sie den Standortzugriff in den Einstellungen.');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen des Standorts:', error);
                setLocationError('Fehler beim Abrufen des Standorts.');
            }
        } else if (selectedOption === 'PLZ') {
            try {
                const coordinates = await getCoordinates(plz);
                if (coordinates) {
                    setCoords(coordinates);
                    setSuchMethode(plz);
                    setPlzError('');
                    setLocationError('');
                    closeModal(setSuchMethodeModalVisible);
                } else {
                    setPlzError('Keine gültige PLZ');
                    setPlz("");
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Koordinaten:', error);
                setPlzError('Keine gültige PLZ');
                setPlz("");
            }
        }
    };

    const applySuchRadiusSelection = (value) => {
        setSuchRadius(value);
        closeModal(setSuchRadiusModalVisible);
    };

    const applySpritartSelection = (value) => {
        setSpritart(value);
        closeModal(setSpritartModalVisible);
    };

    const applyFilterSelection = (value) => {
        setFilter(value);
        closeModal(setFilterModalVisible);
    };

    const applySortiereNachSelection = () => {
        closeModal(setSortiereNachModalVisible);
    };


    const applyMaxErgebnisseSelection = (value) => {
        setMaxErgebnisse(value);
        closeModal(setMaxErgebnisseModalVisible);
    };

    useEffect(() => {
        const loadFilterSettings = async () => {
            try {
                const savedFilters = await AsyncStorage.getItem('filterSettings');
                if (savedFilters !== null) {
                    const filters = JSON.parse(savedFilters);
                    setSuchRadius(`${filters.suchRadius} km`);
                    setSuchMethode(filters.suchMethode);
                    setSpritart(filters.spritart === 'e5' ? 'Super E5'
                        : filters.spritart === 'e10' ? 'Super E10'
                            : filters.spritart === 'diesel' ? 'Diesel'
                                : 'Super E5'); // Standardwert 'Super E5'
                    setFilter(filters.filter ? 'Geöffnet' : 'Alle');
                    setMaxErgebnisse(filters.maxErgebnisse);
                    setCoords(filters.coords || '');
                }
            } catch (error) {
                console.error('Fehler beim Laden der Filtereinstellungen:', error);
            }
        };

        loadFilterSettings();
    }, []);

    const handleSearch = async () => {
        // Konvertiere die Filterwerte wie zuvor
        const convertedRadius = suchRadius.replace(' km', '');
        const convertedFuelType = spritart === 'Super E5' ? 'e5'
            : spritart === 'Super E10' ? 'e10'
                : spritart === 'Diesel' ? 'diesel'
                    : 'all';
        const convertedFilter = filter === 'Geöffnet';
        const convertedSortiereNach = sortiereNach === 'Preis' ? 'price' : 'dist';

        const filters = {
            suchMethode: suchMethode,
            suchRadius: convertedRadius,
            spritart: convertedFuelType,
            filter: convertedFilter,
            maxErgebnisse,
            sortiereNach: convertedSortiereNach,
            coords: coords,
        };

        // Speichere die Filterdaten in AsyncStorage
        try {
            await AsyncStorage.setItem('filterSettings', JSON.stringify(filters));
            console.log('Filtereinstellungen gespeichert:', filters);
        } catch (error) {
            console.error('Fehler beim Speichern der Filtereinstellungen:', error);
        }

        // Weiterleitung der Daten an den HomeScreen
        navigation.navigate("Home-Stack", { filters });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.row} onPress={() => openModal(setSuchMethodeModalVisible)}>
                <Text style={styles.label}>Suchmethode</Text>
                <Text style={styles.value}>{suchMethode}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => openModal(setSuchRadiusModalVisible)}>
                <Text style={styles.label}>Suchradius</Text>
                <Text style={styles.value}>{suchRadius}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => openModal(setSpritartModalVisible)}>
                <Text style={styles.label}>Spritsorte</Text>
                <Text style={styles.value}>{spritart}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => openModal(setFilterModalVisible)}>
                <Text style={styles.label}>Filter</Text>
                <Text style={styles.value}>{filter}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => openModal(setSortiereNachModalVisible)}>
                <Text style={styles.label}>Sortieren nach</Text>
                <Text style={styles.value}>{sortiereNach}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => openModal(setMaxErgebnisseModalVisible)}>
                <Text style={styles.label}>Anzahl Ergebnisse</Text>
                <Text style={styles.value}>{`max. ${maxErgebnisse}`}</Text>
            </TouchableOpacity>

            {/* Modal for Suchmethode */}
            <Modal
                visible={isSuchMethodeModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeModal(setSuchMethodeModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Suchmethode</Text>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                setSelectedOption('aktueller Standort');
                                setPlzError('');
                                setLocationError(''); // Fehlermeldung zurücksetzen, wenn Option geändert wird
                            }}
                        >
                            <Text style={styles.optionText}>Umkreissuche um aktuellen Standort</Text>
                            {selectedOption === 'aktueller Standort' && (
                                <Icon name="check" size={24} color="#ffffff" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                setSelectedOption('PLZ');
                                setLocationError(''); // Fehlermeldung zurücksetzen, wenn Option geändert wird
                            }}
                        >
                            <Text style={styles.optionText}>Umkreissuche um PLZ</Text>
                            {selectedOption === 'PLZ' && (
                                <Icon name="check" size={24} color="#ffffff" />
                            )}
                        </TouchableOpacity>

                        {selectedOption === 'PLZ' && (
                            <>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="PLZ eingeben"
                                    value={plz}
                                    onChangeText={(value) => setPlz(value)}
                                    keyboardType="numeric"
                                />

                                {plzError ? <Text style={styles.errorText}>{plzError}</Text> : null}

                            </>
                        )}

                        {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}

                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={applySuchMethodeSelection}
                        >
                            <Text style={styles.applyButtonText}>Übernehmen</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </Modal>

            {/* Other Modals */}
            <Modal
                visible={isSuchRadiusModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeModal(setSuchRadiusModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Suchradius</Text>
                        {['5 km', '10 km', '15 km', '20 km', '25 km'].map((radius) => (
                            <TouchableOpacity
                                key={radius}
                                style={styles.option}
                                onPress={() => applySuchRadiusSelection(radius)}
                            >
                                <Text style={styles.optionText}>{radius}</Text>
                                {suchRadius === radius && (
                                    <Icon name="check" size={24} color="#ffffff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isSpritartModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeModal(setSpritartModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Spritsorte</Text>
                        {['Super E5', 'Super E10', 'Diesel'].map((fuel) => (
                            <TouchableOpacity
                                key={fuel}
                                style={styles.option}
                                onPress={() => applySpritartSelection(fuel)}
                            >
                                <Text style={styles.optionText}>{fuel}</Text>
                                {spritart === fuel && (
                                    <Icon name="check" size={24} color="#ffffff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isFilterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeModal(setFilterModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter</Text>
                        {['Alle', 'Geöffnet'].map((filterOption) => (
                            <TouchableOpacity
                                key={filterOption}
                                style={styles.option}
                                onPress={() => applyFilterSelection(filterOption)}
                            >
                                <Text style={styles.optionText}>{filterOption}</Text>
                                {filter === filterOption && (
                                    <Icon name="check" size={24} color="#ffffff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isMaxErgebnisseModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeModal(setMaxErgebnisseModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Maximale Ergebnisse</Text>
                        {['10', '25', '50', '100'].map((result) => (
                            <TouchableOpacity
                                key={result}
                                style={styles.option}
                                onPress={() => applyMaxErgebnisseSelection(result)}
                            >
                                <Text style={styles.optionText}>{`max. ${result}`}</Text>
                                {maxErgebnisse === result && (
                                    <Icon name="check" size={24} color="#ffffff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isSortiereNachModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeModal(setSortiereNachModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sortieren nach</Text>
                        {['Entfernung', 'Preis'].map((sortOption) => (
                            <TouchableOpacity
                                key={sortOption}
                                style={styles.option}
                                onPress={() => {
                                    setSortiereNach(sortOption);
                                    applySortiereNachSelection(); // Neue Funktion zum Anwenden und Schließen
                                }}
                            >
                                <Text style={styles.optionText}>{sortOption}</Text>
                                {sortiereNach === sortOption && (
                                    <Icon name="check" size={24} color="#ffffff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>


            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Suche anwenden</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#012A32',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#01ABCB',
    },
    label: {
        fontSize: 18,
        color: 'white',
    },
    value: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#025564',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        color: '#ffffff',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    optionText: {
        fontSize: 16,
        color: '#ffffff',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#4b6a92',
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    applyButton: {
        backgroundColor: '#01ABCB',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    searchButton: {
        backgroundColor: '#01ABCB',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    searchButtonText: {
        color: '#ffffff',
        fontSize: 18,
    },
});

export default FilterScreen;
