import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// First, clear notifications when one arrives
Notifications.addNotificationReceivedListener(async () => {
  console.log("Notification received. Clearing queue...");
  await Notifications.cancelAllScheduledNotificationsAsync(); // Clear the queue
});

// Function to cancel all existing notifications and schedule a new one
async function schedulePushNotification() {
  console.log("Cancelling existing notifications...");
  await Notifications.cancelAllScheduledNotificationsAsync(); // Stop previous notifications

  console.log("Scheduling new notification...");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "extra data goes here" },
    },
    trigger: {
      type: 'timeInterval',
      seconds: 15, // Appears after 10 seconds
      repeats: false, // Ensures it does NOT repeat
    },
  });
}

// Main App Component
export default function App() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>helooji</Text>

      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}
