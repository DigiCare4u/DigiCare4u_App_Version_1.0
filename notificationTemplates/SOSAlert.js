import {useEffect} from 'react';
import {onEvent} from '../services/socket/config';
import notifee, {AndroidImportance} from '@notifee/react-native';
//================================
export const SOSAlert = async notification => {
  try {
    const length = Object.keys(notification).length;

    if (length <= 0) {
      return;
    }
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default!',
      name: 'Default Channel1',
      sound: 'sos', // Use the file name from your raw folder

      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    return await notifee.displayNotification({
      title: notification.title || 'SOS Alert !',
      body: notification.message || 'You have a new message.',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Replace with your notification icon
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Notification Error:', error);
  }
};
