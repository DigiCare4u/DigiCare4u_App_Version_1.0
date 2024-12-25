import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native'
import React from 'react'
import notifee from '@notifee/react-native';


const notification = () => {
  async function onDisplayNotification() {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: 'Hello!',
        body: 'This is your notification content.',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Notification Error:', error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>React Native Notifee Example</Text>
        <Button title="Display Notification" onPress={onDisplayNotification} />
      </View>
    </SafeAreaView>
  )
}

export default notification

const styles = StyleSheet.create({})
