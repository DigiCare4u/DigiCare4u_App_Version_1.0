import React from 'react';
import { View, Text} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import UserHome from '../../screen/user/home';
import UserDashboard from '../../screen/user/dashboard';
import MemberList from '../../screen/user/members';
import UserFeed from '../../screen/user/feed';
import UserProfile from '../../screen/user/profile';

const Tab = createBottomTabNavigator();


export default function UserTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard:"true",
    }}>
      <Tab.Screen
        name="Map"
        component={UserHome}
        options={{
          headerShown: false,
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
         <Tab.Screen
        name="Dashboard"
        component={UserDashboard}
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
        name="Members"
        component={MemberList}
        options={{
          tabBarLabel: 'Employees',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="badge" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
      name="Feed"
      component={UserFeed}
      options={{
        tabBarIcon: 'Feed',
        headerShown:false,
        tabBarIcon:({color, size}) =>(
          <Icon name="edit" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
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
