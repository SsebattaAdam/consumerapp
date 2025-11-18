import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Homepage from '../../home/screens/Homepage';
import FavoritesScreen from '../../home/screens/FavoritesScreen';
import ProfileScreen from '../../home/screens/ProfileScreen';
import { COLORS } from '../../../core/constants/app_constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';





const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = focused ? 'account' : 'account-outline';
          }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },

        //  Keep icon colors unchanged
        tabBarActiveTintColor: COLORS.dark22,
        tabBarInactiveTintColor: 'gray',

        //  Prevent blur from affecting active tab highlight
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',

        headerShown: false,

        //  Glass background style
        tabBarStyle: styles.tabBarStyle,

      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: COLORS.offWhite,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    shadowOpacity: 0,
    elevation: 0,
    
  },
});
