import {useEffect} from 'react';
import {onEvent} from '../services/socket/config';
import notifee, {AndroidImportance} from '@notifee/react-native';
//================================
export const MemberVerifiedNotification = async notification => {
  try {
    // Request permissions (required for iOS)
    console.log(
      'notification___________lenght',
      notification,
      notification.length,
    );
    const length = Object.keys(notification).length;
    // console.log('len ----->',length); // Output: 3

    if (length <= 0) {
      return;
    }
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
      title: notification.title || 'Member Verified !',
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

