import { View , Text , StyleSheet , Pressable , TextInput , FlatList, useColorScheme} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {ThemeContext} from '@/context/ThemeContext'
import { useState } from "react";
import { useEffect } from "react";
import {useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors'
import { ThemeProvider } from "@/context/ThemeContext";
import {StatusBar} from 'react-native'
import Animated , {LinearTransition} from 'react-native-reanimated'
import {data} from '../data/todos'
import {useFonts} from 'expo-font'
import Octicons from '@expo/vector-icons/Octicons'
import {Picker} from '@react-native-picker/picker'
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Name from './name'
import * as Notifications from "expo-notifications";
import {Alert} from 'react-native'
import { Button } from "react-native";


export default function Index() {

  const [username , setUserName] = useState('')

  const [todos , setTodos] = useState([])

  const [text , setText] = useState('')

  const [taskPriority , setTaskPriority] = useState("Low")

  const getTime =  new Date().getHours();
  
  const greeting = getTime >= 0 && getTime < 12 ? "Good Morning," : (getTime >= 12 && getTime <16)? "Good Afternoon," : (getTime >=16 && getTime < 18 )? "Good Evening," : "Good Night,"

 
  const router = useRouter()


  const [selectedInterval , setSelectedInterval ] = useState("9/12/3/6/9");


  

  const {theme , colorScheme , setColorScheme } = useContext(ThemeContext)
  

  const styles = createStyles(theme , colorScheme);

  const [loaded , error ] = useFonts({
    'SmoochSans' : require('../assets/fonts/SmoochSans.ttf')
  })

// useEffect to load username

useEffect(() => {
  (async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await requestPermissions();
    }
  })();
}, []);


const requestPermissions = async () => {
  const {status} = await Notifications.requestPermissionsAsync();

  if ( status != "granted"){
    Alert.alert("Permission denied! , You need to enable notification Permission from Settings ");
    return false;
  }
  return true;
}

useEffect( () =>{

  async function loadStoredInterval(){
    try{
      const savedInterval = await AsyncStorage.getItem("selectedInterval")
      if(savedInterval){
        setSelectedInterval(savedInterval)
      }
    }
    catch(e){
      console.error(e)
    }
  }
  loadStoredInterval()
},[])

const handleIntervalChange = async (itemValue) => {
  const permissionGranted = await requestPermissions(); // Check first
  if (!permissionGranted) return; // Stop if not granted

  setSelectedInterval(itemValue);
  await AsyncStorage.setItem("selectedInterval", itemValue);
  scheduleNotifications(itemValue);
};


const scheduleNotifications = async (interval) => {
  // 🔹 Check if permission is granted before scheduling notifications
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Needed", "Please enable notifications in settings.");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = {
    "9/12/3/6/9": [9, 12, 15, 18, 21],
    "10/1/4/7/10": [10, 13, 16, 19, 22],
    "Morning/Evening": [9, 18],
  };

  const selectedTimes = times[interval] || [];

  for (let hour of selectedTimes) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "It's time for your scheduled Reminder!",
      },
      trigger: {
        hour,
        minute: 0,
        repeats: true,
      },
    });
  }
};




useEffect ( () => {
  const fetchName = async()=>{
    try{
      const savedName = await AsyncStorage.getItem("username")
      if(savedName){
        setUserName(savedName)
      }
      else{
        router.push('/name')
      }

    }
    catch(e){
      console.error(e)

    }

  }
  fetchName()
},[])



// useEffect to load data

  useEffect( () => {
    const fetchData = async ()=> {
      try{
        const jsonValue = await AsyncStorage.getItem("beffex")
        const storedTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        

        if(storedTodos && storedTodos.length){
          setTodos(storedTodos.sort((a,b) => b.id - a.id))
        }
        else{
          setTodos(data.sort((a,b) => b.id - a.id))
        }

      }
      catch(e){
        console.error(e)

      }
    }
    fetchData()
  } ,[]) 

// useEffect to store data

  useEffect(() => {
    const storeData = async () =>{
      try{
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("beffex" , jsonValue)

      }
      catch(e){
        console.error(e)

      }

    }
    storeData()
  } , [todos])

// if font not loaded 

  if (!loaded || error) {
    return <Text>Loading...</Text>;
  }
  

  const addTodo = ()=>{
    if(text.trim()){
      const newId = todos.length === 0? 1 : todos[0].id + 1;
      setTodos([{id : newId , title: text , completed: false , priority: taskPriority } , ...todos])
      setText('')
    }
  }

  const removeTodo = (id)=>{
    setTodos(todos.filter( todo => todo.id !== id))
  }

// Render item for flatlist
  const renderItem = ({item}) => {
    
    const priority  = item.priority ? item.priority.toLowerCase() : 'low'
    const kolor =   priority === 'high' ? 'red' : priority=== 'medium' ?'yellow':'green'

    return(

      <View style = {styles.todoItem}>
        <View style = {styles.titlePrio}>
          <Text style = {styles.todoText}>
            {item.title} 
          </Text>
          <Text style = {{color: kolor,fontSize: 10 , fontWeight: 'bold' , marginLeft: 4, marginTop: 4,
          backgroundColor: theme === 'dark'
          ? (priority === 'high' ? 'rgba(255,0,0,0.2)' : priority === 'medium' ? 'rgba(139, 128, 0,0.3)' : 'rgba(0,255,0,0.2)')
          : (priority === 'high' ? 'rgba(255,0,0,0.2)' : priority === 'medium' ? 'rgba(139, 128, 0,0.3)' : 'rgba(0,255,0,0.2)')
          , borderRadius: 8, padding: 3,  }}>
            {priority[0].toUpperCase() + priority.slice(1)}
          </Text>
        </View>
        <Pressable
        onPress = { () => removeTodo(item.id)}>
        <MaterialIcons name="delete" size={24} color={theme.iconColor} style = {styles.deleteButton} />
        </Pressable>

      </View>
    )
  }


  return (
    
    <SafeAreaProvider style = {styles.container}>
      <StatusBar backgroundColor='black' barStyle='light-content'/>
      {username ? (
        <View>
          <View style={styles.greetingHeader}>
            <Text style={styles.greeting}>{greeting} {username}</Text>
            <Pressable onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')} style={styles.themeToggleButton}>
              <Octicons name={colorScheme === 'dark' ? 'moon' : 'sun'} size={36} color={theme.textColor} style={{ width: 36 }} />
            </Pressable>
          </View>

          <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'SmoochSans', marginLeft: 15, color: theme.textColor }}>
            Here's your prioritized Todos for Today:
          </Text>

          <Animated.FlatList
            style={styles.listBlock}
            data={todos}
            renderItem={renderItem}
            keyExtractor={todo => todo.id.toString()}
            itemLayoutAnimation={LinearTransition}
          />

          <Text style={{ fontWeight: 'bold', marginTop: 10, marginHorizontal: 'auto', textDecorationLine: 'underline', color: theme.headingColor }}>
            Add A New Task
          </Text>

          <TextInput style={styles.input} placeholder="What's on your mind?" placeholderTextColor={theme.textColor} value={text} onChangeText={setText} />
          <View style = {styles.priorityBlock}>
            <Text style = {{ color: theme.textColor,fontWeight: 'bold' ,}}>
              Priority: 
            </Text>
            <View style = {styles.pickerContainer}>
              <Picker
              style = {styles.picker}
              selectedValue = {taskPriority}
              onValueChange = { prio => setTaskPriority(prio) }
              >
                <Picker.Item label="Low" value="Low"/>
                <Picker.Item label="Medium" value="Medium"/>
                <Picker.Item label="High" value="High"/>

              </Picker>
            </View>
          </View>
          <Pressable style={styles.saveButton} onPress={() => {
            if (text.trim()) {
              const newId = todos.length === 0 ? 1 : todos[0].id + 1;
              setTodos([{ id: newId, title: text, completed: false, priority: taskPriority }, ...todos]);
              setText('');
            }
          }}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </Pressable>
          <View style = {styles.priorityBlock}>
            <Text style = {{ color: theme.textColor,fontWeight: 'bold' ,}}>
              Reminder Frequency:
            </Text>
            <View style = {[styles.pickerContainer , {marginRight: 15}]}>
              <Picker
              style = {[styles.picker]}
              selectedValue={selectedInterval}
              onValueChange={handleIntervalChange}>
                <Picker.Item label = "9/12/3/6/9" value = "9/12/3/6/9" />
                <Picker.Item label = "10/1/4/7/10" value = "10/1/4/7/10" />
                <Picker.Item label = "Morning/Evening" value = "Morning/Evening" />
              </Picker>
            </View>
          </View>
        </View>
      ) : (
        <Name setUserName={setUserName} />
      )}
    </SafeAreaProvider>
  );
}
function createStyles(theme , colorScheme) {
  return(
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      greeting: {
        color: theme.textColor,
        fontFamily:'SmoochSans',
        fontWeight: 'bold',
        fontSize: 28,
        marginTop: 20,
        padding: 15,
      },
      todoItem:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderBottomColor: 'gray',
        width: '100%',
        justifyContent: 'space-between',
      },
      todoText:{
        fontSize: 20,
        color: theme.textColor,
        padding: 2,
      },
      greetingHeader:{
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'space-between',
      },
      themeToggleButton:{
        padding: 15,
        marginTop: 10,
      },
      listBlock: {
        marginHorizontal: 'auto',
        marginTop: '5%',
        padding: 20,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20,
        width: '90%',
        maxHeight: 300,
        
      },
      priorityBlock:{
        marginTop: 10,
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
      },
      pickerContainer:{
        justifyContent: 'flex-end',
        width: '50%',
        marginLeft: 10,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: theme.iconColor,

      },
      picker:{
        color: theme.textColor,
        backgroundColor: theme.blockColor,

      },
      input: {
        color : theme.textColor,
        marginTop: 20,
        borderColor: theme.iconColor,
        borderWidth: 2,
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 'auto',
        width: '90%',
        backgroundColor: theme.blockColor,
      },
      saveButton:{
        marginTop: 5,
        marginLeft: 20,
        backgroundColor: theme.buttonColor,
        borderRadius: 5,
        padding: 5,
        width: 60,
      },
      saveButtonText:{
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center'
      },
      deleteButton:{
        marginLeft: 'auto',
       
      },
      titlePrio:{
        flexDirection: 'row',
        alignItems: 'center',
      },
    
    })
  )

}