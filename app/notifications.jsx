import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import React, {useContext } from "react";
import { TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { Picker } from '@react-native-picker/picker';
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
async function schedulePushNotification(title,body) {
  console.log("Cancelling existing notifications...");
  await Notifications.cancelAllScheduledNotificationsAsync(); // Stop previous notifications

  console.log("Scheduling new notification...");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || "You've got a Reminder 📬",
      body: body || "You've come so far, you cant stop now💪",
      data: { data: "extra data goes here" },
    },
    trigger: {
      type: 'timeInterval',
      seconds: 5, // Appears after 10 seconds
      repeats: false, // Ensures it does NOT repeat
    },
  });
}

// Main App Component
export default function ReminderScreen() {
  const [selectedTime, setSelectedTime] = useState("08:00 AM");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { theme, colorScheme, setColorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  return (
      <SafeAreaProvider style={styles.container}>
          <Text style={styles.heading}>Set a Reminder</Text>
          
          <Text style={styles.label}>Notification Title</Text>
          <TextInput 
              style={styles.input} 
              placeholder="Enter title" 
              placeholderTextColor="rgb(113, 121, 126)"
              value={title} 
              onChangeText={setTitle} 
          />
          
          <Text style={styles.label}>Notification Body</Text>
          <TextInput 
              style={styles.input} 
              placeholder="Enter message" 
              placeholderTextColor="rgb(113, 121, 126)"
              value={body} 
              onChangeText={setBody} 
          />
          
          <Text style={styles.label}>Select Time</Text>
          <View style = {styles.pickerContainer}>
            <Picker
                dropdownIconColor={theme.textColor}
                selectedValue={selectedTime}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedTime(itemValue)}
            >
                <Picker.Item label = "9am/12pm/3pm/6pm/9pm" value = "9am/12pm/3pm/6pm/9pm" />
                <Picker.Item label = "10am/1pm/4pm/7pm/10pm" value = "10am/1pm/4pm/7pm/10pm" />
                <Picker.Item label="Morning/Evening" value="Morning/Evening" />
                <Picker.Item label="Custom Reminder Timing" value="Custom Reminder Timing" />
            </Picker>
          </View>
          {/*Show textInput to enter custom reminder notification timing */}
          {selectedTime === "Custom Reminder Timing" &&(
            <TextInput
            style={styles.input}
            placeholder='AM/PM'
            placeholderTextColor="rgb(113, 121, 126)" />
          )}
          
          <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Confirm Reminder</Text>
          </TouchableOpacity>
          
          <Button
              title="Press to schedule a notification"
              onPress={async () => {
                  await schedulePushNotification(title,body);
              }}
          />
      </SafeAreaProvider>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
      container: {
          flex: 1,
          backgroundColor: theme.background,
          padding: 20,
      },
      heading: {
          fontSize: 22,
          fontWeight: "bold",
          color: theme.reminderHeadingColor,
          marginBottom: 20,
      },
      label: {
          color: theme.textColor,
          fontSize: 16,
          marginTop: 10,
      },
      input: {
        backgroundColor: theme.blockColor,
        borderWidth:2,
        borderColor: theme.iconColor,
        color : theme.textColor,
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
      },
      picker: {
        color: theme.textColor,
        backgroundColor: theme.blockColor,
        borderRadius: 5,
        marginTop: 5,
        borderWidth: 2,
        
      },
      button: {
        backgroundColor: theme.buttonColor,
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
        marginBottom: 30,
      },
      buttonText: {
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
      },
      pickerContainer:{
        marginTop: 4,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: theme.iconColor,
        marginBottom: 10,
      },
  });
}

