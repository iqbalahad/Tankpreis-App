// components/FilterButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FilterButton = ({ onPress, iconSize = 30, iconColor = "#000", style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Icon name="menu" size={iconSize} color={"white"} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        paddingTop: 5,
        paddingLeft: 7,
        marginLeft: 0,
    },
});


export default FilterButton;
