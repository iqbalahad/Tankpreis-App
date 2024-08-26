import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import dayAbbreviations from '../data/dayAbbreviations.json'; 

const DetailScreen = ({ route }) => {
    const { details } = route.params;

    
    const currentStatus = details.isOpen ? "Aktuell geöffnet" : "Aktuell geschlossen";
    const statusColor = details.isOpen ? '#4CAF50' : '#F44336'; 

    
    const formatOpeningTimes = (times) => {
        if (!times || times.length === 0) {
            return <Text style={styles.noDataText}>Keine Öffnungszeiten gefunden</Text>;
        }

        const groupedTimes = times.reduce((acc, time) => {
            const day = dayAbbreviations[time.text] || time.text;
            const timeRange = `${time.start} - ${time.end}`;

            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(timeRange);

            return acc;
        }, {});

        return (
            <View style={styles.openingTimesContainer}>
                {Object.keys(groupedTimes).length > 0 ? (
                    Object.keys(groupedTimes).map(day => (
                        <View key={day} style={styles.openingTimeRow}>
                            <Text style={styles.openingTimeDay}>{day}</Text>
                            <Text style={styles.openingTimeTimes}>{groupedTimes[day].join(', ')}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>Keine Öffnungszeiten gefunden</Text>
                )}
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Station Name */}
            <Text style={styles.name}>{details.name}</Text>

            {/* Address */}
            <Text style={styles.address}>
                {details.street} {details.houseNumber}
            </Text>
            <Text style={styles.address}>
                {details.postCode}, {details.place}
            </Text>

            {/* Current Status */}
            <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{currentStatus}</Text>
            </View>

            {/* Current Prices */}
            <Text style={styles.sectionTitle}>Aktuelle Preise:</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Diesel:</Text>
                <Text style={styles.priceValue}>{details.diesel} €/l</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Super E5:</Text>
                <Text style={styles.priceValue}>{details.e5} €/l</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Super E10:</Text>
                <Text style={styles.priceValue}>{details.e10} €/l</Text>
            </View>

            {/* Opening Times */}
            <Text style={styles.sectionTitle}>Öffnungszeiten:</Text>
            {formatOpeningTimes(details.openingTimes)}

            {/* Holiday Opening Times */}
            {details.overrides.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Öffnungszeiten bei Feiertagen:</Text>
                    {details.overrides.map((override, index) => (
                        <View key={index} style={styles.openingTimeRow}>
                            <Text style={styles.openingTimeDay}>{override.text}</Text>
                            <Text satyle={styles.openingTimeTimes}>{override.start} - {override.end}</Text>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#012A32',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    address: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    statusContainer: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 15,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#01ABCB',
        marginTop: 20,
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#01ABCB',
    },
    priceLabel: {
        fontSize: 18,
        color: 'white',
    },
    priceValue: {
        fontSize: 18,
        color: 'white',
    },
    openingTimesContainer: {
        marginBottom: 20,
    },
    openingTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#01ABCB',
        flexWrap: 'wrap', // Allow wrapping of text
    },
    openingTimeDay: {
        fontSize: 18,
        color: 'white',
        flex: 1,
        textAlign: 'left',
    },
    openingTimeTimes: {
        fontSize: 16,
        color: 'white',
        flex: 2,
        textAlign: 'right',
    },
    noDataText: {
        fontSize: 18,
        color: 'white',
        marginVertical: 20,
    },
});

export default DetailScreen;
