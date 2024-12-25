import * as React from 'react';
import {AuthProvider} from './context/auth';
import {SocketProvider} from './context/socket';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screen/SplashScreen';
import LoginScreen from './screen/Login/index';
import SignupScreen from './screen/SignupScreen';
import MemberDetail from './screen/MemberDetail';
import EditProfileScreen from './screen/EditProfileScreen';
import {devURL} from './constants/endpoints';
import {initializeSocket} from './services/socket/config';
import UserTabNavigator from './components/Navigator/User';
import MemberTabNavigator from './components/Navigator/Member';
import Notification from './screen/notification';
import Mapbox from '@rnmapbox/maps';

import {NativeModules} from 'react-native';
const {WorkManager} = NativeModules;

const Stack = createStackNavigator();

import {AppState} from 'react-native';

export default function App() {
  // const handleAppStateChange = nextAppState => {
  //   console.log(NativeModules.WorkManager);

  //   if (nextAppState === 'background') {
  //     console.log('App went to background, scheduling worker...');
  //     WorkManager?.enqueueUniqueWork('AppKilledWorker');
  //   }
  // };

  // // WorkManager?.enqueueUniqueWork('AppKilledWorker');
  // AppState.addEventListener('change', handleAppStateChange);
  //== CONFIGURATION ===============================
  // const initSocket = async () => {
  //   await initializeSocket(devURL);
  // };

  // React.useEffect(() => {
  //   initSocket();
  // }, []);

  const accessToken =
    'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token

  Mapbox.setAccessToken(accessToken);

  //===========================================

  return (
    <AuthProvider>
      {/* <SocketProvider> */}
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MemberDetail"
              component={MemberDetail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Notifications"
              component={Notification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MemberProfileEdit"
              component={EditProfileScreen}
              options={{headerShown: false}}
            />

            {/* tabs */}
            <Stack.Screen
              name="Home/user"
              component={UserTabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home/member"
              component={MemberTabNavigator}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      {/* </SocketProvider> */}
    </AuthProvider>
  );
}
