// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import FavoritenScreen from '../screens/FavoritenScreen';
import FilterScreen from '../screens/FilterScreen';
import { Ionicons } from 'react-native-vector-icons';
import FilterButton from '../components/FilterButton';
import DetailScreen from '../screens/DeatailScreen';


const HomeStack = createStackNavigator();
const FavoritenStack = createStackNavigator();

const HomeStackNavigator = () => (
    <HomeStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#025564',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <HomeStack.Screen
            name="Home-Stack"
            component={HomeScreen}
            options={({ navigation }) => ({
                title: 'Home',
                headerLeft: () => (
                    <FilterButton
                        onPress={() => navigation.navigate('Filter')}
                    />
                ),
            })}
        />
        <HomeStack.Screen
            name="Filter"
            component={FilterScreen}
            options={{ title: 'Filter' }}
        />
        <HomeStack.Screen
            name="Details"
            component={DetailScreen}
            options={{ title: 'Details', }}
        />
    </HomeStack.Navigator>
);

const FavoritenStackNavigator = () => (
    <FavoritenStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#025564',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <FavoritenStack.Screen
            name="FavoritenStack"
            component={FavoritenScreen}
            options={({ navigation }) => ({
                title: 'Favoriten',
            })}

        />
        <FavoritenStack.Screen
            name="Details"
            component={DetailScreen}
            options={{ title: 'Details' }}
        />

    </FavoritenStack.Navigator>
);

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: { backgroundColor: '#025564' },
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Favoriten') {
                    iconName = focused ? 'star' : 'star-outline';
                } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Favoriten" component={FavoritenStackNavigator} />
    </Tab.Navigator>
);

export default AppNavigator;
