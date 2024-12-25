import notifee, { AndroidImportance } from '@notifee/react-native';

export const backgroundRequest = async () => {
    try {
        // Ensure the `notification` object is defined or imported correctly
        if (!notification || Object.keys(notification).length <= 0) {
            console.log('No notifications to display.');
            return;
        }

        console.log('Notification length:', Object.keys(notification).length);

        // Create a notification channel for Android
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'congrat',
            importance: AndroidImportance.HIGH,
        });

        // Display the notification
        await notifee.displayNotification({
            title: 'Media uploaded',
            body: 'Your media has been successfully uploaded',
            android: {
                channelId: channelId,
            },
            ios: {
                attachments: [
                    {
                        // iOS resource
                        url: 'local-image.png',
                        thumbnailHidden: true,
                    },
                    {
                        // Local file path
                        url: '/Path/on/device/to/local/file.mp4',
                        thumbnailTime: 3, // optional
                    },
                    {
                        // React Native asset
                        url: require('./assets/my-image.gif'),
                    },
                    {
                        // Remote image
                        url: 'https://my-cdn.com/images/123456.png',
                    },
                ],
            },
        });

        console.log('Notification displayed successfully.');
    } catch (error) {
        console.error('Notification error:', error);
    }
};
