import * as React from 'react';
import { AuthProvider } from './context/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screen/SplashScreen';
import LoginScreen from './screen/Login/index';
import SignupScreen from './screen/Signup';
import MemberDetail from './screen/MemberDetail';
import EditProfileScreen from './screen/EditProfileScreen';
import ForgetPassword from './screen/ForgetPasswordScreen';
import OtpScreen from './screen/OtpScreen';
// import MemberAssignmentMap from './screen/MemberAssignmentMap'
// import UserAssignmentMap from './screen/UserAssignmentMap'
import { devURL } from './constants/endpoints';
import { initializeSocket } from './services/socket/config';
import UserTabNavigator from './components/Navigator/User';
import MemberTabNavigator from './components/Navigator/Member';
import Notification from './screen/notification';
import Mapbox from '@rnmapbox/maps';
import notifee from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';

import { NativeModules } from 'react-native';
const { WorkManager } = NativeModules;

const Stack = createStackNavigator();

import { AppState } from 'react-native';

export default function App() {

  // React.useEffect(() => {
  //   const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
  //     console.log('Foreground Event:', type, detail);

  //     switch (type) {
  //       case notifee?.EventType?.PRESS:
  //         console.log('Notification Pressed:', detail.notification);
  //         break;
  //       case notifee?.EventType?.DISMISSED:
  //         console.log('Notification Dismissed:', detail.notification);
  //         break;
  //       default:
  //         break;
  //     }
  //   });

  //   return () => unsubscribe(); // Cleanup on unmount
  // }, []);
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


  // React.useEffect(() => {
  //   // Request permission to receive notifications (on iOS)
  //   messaging()
  //     .requestPermission()
  //     .then(() => console.log('Notification permission granted'))
  //     .catch(() => Alert.alert('Permission Denied', 'You need to grant notification permission.'));
    
  //   // Get the FCM token when the app starts
  //   const getFCMToken = async () => {
  //     const token = await messaging().getToken();
  //     console.log('FCM Token at app initialization:', token);
  //     // Optionally, store it in a global state or context
  //   };

  //   getFCMToken();

  //   // You can also handle foreground notifications here
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('Received in foreground:', remoteMessage);
  //     // Handle foreground notification
  //   });

  //   return unsubscribe; // Cleanup on unmount
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ForgetPassword"
            component={ForgetPassword}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="Otp"
            component={OtpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MemberDetail"
            component={MemberDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MemberProfileEdit"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="MemberAssignmentMap"
            component={MemberAssignmentMap}
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen
            name="UserAssignmentMap"
            component={UserAssignmentMap}
            options={{ headerShown: false }}
          /> */}


          {/* tabs */}
          <Stack.Screen
            name="Home/user"
            component={UserTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home/member"
            component={MemberTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* </SocketProvider> */}
    </AuthProvider>
  );
}
