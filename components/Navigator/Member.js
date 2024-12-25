import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconinsight from 'react-native-vector-icons/Feather';
import MemberHome from '../../screen/member/home';
import MemberDashboard from '../../screen/member/dashboard';
import MemberInsight from '../../screen/member/insights';
import MemberFeed from '../../screen/member/feed';
import MemberProfile from '../../screen/member/profile';

const Tab = createBottomTabNavigator();

export default function MemberTabNavigator() {
  //=======================================================
 
  //=======================================================


  return (
    <Tab.Navigator>
      <Tab.Screen
        name="MemberMap"
        component={MemberHome}
        options={{
          headerShown: false,
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MemberDashboard"
        // initialParams={{ location }}

        component={MemberDashboard}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MemberInsight"
        component={MemberInsight}
        options={{
          headerShown: false,
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <Iconinsight name="bar-chart" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="MemberFeed"
        component={MemberFeed}
        options={{
          title: 'Channels',
          tabBarIcon: 'Feed',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="edit" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="MemberProfile"
        component={MemberProfile}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
