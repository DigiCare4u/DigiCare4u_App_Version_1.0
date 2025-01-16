// import notifee, { AndroidImportance } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';

// // Handle background messages
// export async function backgroundMessageHandler(remoteMessage) {
//     console.log('Message handled in the background!', remoteMessage);

//     if (remoteMessage.notification) {
//         const { title, body } = remoteMessage.notification;

//         // Display a notification
//         await notifee.displayNotification({
//             title,
//             body,
//             android: {
//                 channelId: 'default', // Make sure this matches the created channel ID
//                 importance: AndroidImportance.HIGH,
//                 pressAction: {
//                     id: 'default', // ID of the action, customizable
//                 },
//             },
//         });
//     }
// }
