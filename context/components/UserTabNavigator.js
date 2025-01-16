import React from 'react';
import { View, Text} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import EmployeScreen from '../screen/EmployeScreen';
import UserMap from '../screen/UserMap';
import ChatUser from '../screen/ChatUser';

const Tab = createBottomTabNavigator();

export default function UserTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard:"true",
    }}>
      <Tab.Screen
        name="Map"
        component={UserMap}
        options={{
          headerShown: false,
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
         <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
           <View   style={{
            // backgroundColor: "blue",
            // height: size + 10,
            // width: size + 10,   
            // borderRadius: (size + 10) / 2,
            // justifyContent: "center",
            // alignItems: "center",
          }} >
             <Icon name="home" color={color} size={size} />
           </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Employe"
        component={EmployeScreen}
        options={{
          tabBarLabel: 'Employees',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="badge" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
      name="Chat"
      component={ChatUser}
      options={{
        tabBarIcon:'Talk',
        headerShown:false,
        tabBarIcon:({color, size}) =>(
          <Icon name="edit" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
