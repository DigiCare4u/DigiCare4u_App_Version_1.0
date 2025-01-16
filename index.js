import { AppRegistry } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
// import { backgroundMessageHandler } from './backgroundMessageHandler';

// Handle Notifee background events
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//     console.log('Background Event:', type, detail);

//     // switch (type) {
//     //     case notifee.EventType.PRESS:
//     //         // Handle notification press event
//     //         console.log('Notification Pressed:', detail.notification);
//     //         break;
//     //     case notifee.EventType.DISMISSED:
//     //         // Handle notification dismiss event
//     //         console.log('Notification Dismissed:', detail.notification);
//     //         break;
//     //     default:
//     //         break;
//     // }
// });

// Handle Firebase Messaging background messages
// messaging().setBackgroundMessageHandler(backgroundMessageHandler);

// Register the app component
AppRegistry.registerComponent(appName, () => App);
