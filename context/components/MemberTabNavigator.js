import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeMember from '../screen/HomeMember';
import MemberProfile from '../screen/MemberProfile';
import MemberInsightScreen from '../screen/MemberInsightScreen';
import Iconinsight from 'react-native-vector-icons/Feather';
import MemberMap from '../screen/MemberMap';
import ChatMember from '../screen/ChatMember';

const Tab = createBottomTabNavigator();

export default function MemberTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Map"
        component={MemberMap}
        options={{
          headerShown: false,
          tabBarLabel: 'Map',
          tabBarIcon: ({color, size}) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HomeMember"
        component={HomeMember}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MemberInsight"
        component={MemberInsightScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Insights',
          tabBarIcon: ({color, size}) => (
            <Iconinsight name="bar-chart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatMember}
        options={{
          title: 'Channels',
          tabBarIcon: 'Talk',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="edit" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MemberProfile"
        component={MemberProfile}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
