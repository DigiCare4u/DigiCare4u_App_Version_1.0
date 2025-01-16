import { useEffect } from 'react';
import { onEvent } from '../services/socket/config';
import notifee, { AndroidImportance } from '@notifee/react-native';
//================================
export const GenericNotification = async (title,body) => {
  try {

    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'congrat', // Use the file name from your raw folder

      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    return await notifee.displayNotification({
      title: title,
      body: body,
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

