import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import React, { useContext } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { Picker } from '@react-native-picker/picker';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request Notification Permissions
async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Please enable notification permissions from settings');
  }
}



// Function to validate time format entered by user
function isValidTimeFormat(time) {
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time);
}

// Function to cancel all existing notifications and schedule a new one
async function schedulePushNotification(title, body, times) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();

  for (const time of times) {
    if (!isValidTimeFormat(time)) {
      Alert.alert('Invalid Time Format', 'Please enter time in HH:mm format.');
      return;
    }

    const [hour, minute] = time.split(':').map(Number);
    let triggerTime = new Date();
    triggerTime.setHours(hour, minute, 0, 0); // Set exact time

    // If selected time has already passed today, schedule for tomorrow
    if (triggerTime.getTime() <= now.getTime()) {
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    // Calculate seconds until notification
    const secondsUntilNotification = Math.floor((triggerTime - now) / 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "You've got a Reminder 📬",
        body: body || "You've come so far, you can't stop now💪",
      },
      trigger: {
        type:'timeInterval',
        seconds: secondsUntilNotification,
        repeats: false,
      },
    });
    console.log(`Scheduling notification for: ${time}`);

  }

  Alert.alert('Reminder Set', 'Your notifications have been scheduled.');
}




// Main App Component
export default function ReminderScreen() {
  const [selectedTime, setSelectedTime] = useState('08:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const handleConfirmReminder = async () => {
    let times = [];
    
    if (selectedTime === 'Custom Reminder Timing' && customTime) {
      times = customTime.split('/').map(t => t.trim());
    } else {
      const presetTimes = {
        '9am/12pm/3pm/6pm/9pm': ['09:00', '12:00', '15:00', '18:00', '21:00'],
        '10am/1pm/4pm/7pm/10pm': ['10:00', '13:00', '16:00', '19:00', '22:00'],
        'Morning/Evening': ['08:00', '20:00'],
      };
      times = presetTimes[selectedTime] || [];
    }
  
    if (times.length > 0) {
      await schedulePushNotification(title, body, times);
    } else {
      Alert.alert('Error', 'Please select or enter a valid time.');
    }
  };
  useEffect(() => {
    requestPermissions().then(() => {
      console.log("Notification permissions checked.");
    });
  
    const subscription = Notifications.addNotificationReceivedListener(() => {
      console.log("Notification received. ");
      
    });
  
    return () => {
      subscription.remove();
    };
  }, []);
  
  
  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.heading}>Set a Reminder</Text>
      
      <Text style={styles.label}>Notification Title</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Enter title' 
        placeholderTextColor='rgb(113, 121, 126)'
        value={title} 
        onChangeText={setTitle} 
      />
      
      <Text style={styles.label}>Notification Body</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Enter message' 
        placeholderTextColor='rgb(113, 121, 126)'
        value={body} 
        onChangeText={setBody} 
      />
      
      <Text style={styles.label}>Select Time</Text>
      <View style={styles.pickerContainer}>
        <Picker
          dropdownIconColor={theme.textColor}
          selectedValue={selectedTime}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
        >
          <Picker.Item label='9am/12pm/3pm/6pm/9pm' value='9am/12pm/3pm/6pm/9pm' />
          <Picker.Item label='10am/1pm/4pm/7pm/10pm' value='10am/1pm/4pm/7pm/10pm' />
          <Picker.Item label='Morning/Evening' value='Morning/Evening' />
          <Picker.Item label='Custom Reminder Timing' value='Custom Reminder Timing' />
        </Picker>
      </View>
      
      {selectedTime === 'Custom Reminder Timing' && (
        <TextInput
          style={styles.input}
          placeholder='Enter 24-Hour Clock Timings separated by a slash(/)'
          maxLength={20}
          onChangeText={setCustomTime}
          placeholderTextColor='rgb(113, 121, 126)'
        />
      )}
      
      <Button
        title='Press to schedule notifications'
        onPress={handleConfirmReminder}
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

