import { Text , View , StyleSheet , TextInput , Pressable} from 'react-native'
import { useState } from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context";
import {ThemeContext} from '@/context/ThemeContext'
import {useContext } from "react";
import Colors from '../constants/Colors'
import { ThemeProvider } from "@/context/ThemeContext";
import {StatusBar} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Name(){

    const [username , setUserName ] = useState('')
    const {theme , colorScheme , setColorScheme } = useContext(ThemeContext)
    const styles = createStyles(theme , colorScheme)
    const router = useRouter()

    const saveUserName = async()=>{
        try{
            await AsyncStorage.setItem("username" , username);
            router.push('/')

        }
        catch(e){
            console.error(e)

        }
    }

    return (
        <SafeAreaProvider>
        <View style = {styles.container}>
            <View style = {styles.nameContainer}>
            <Text style = {styles.title}>What Should I Call you? </Text>
                <TextInput
                style = {styles.input}
                placeholder='Enter Your Name'
                placeholderTextColor='gray'
                maxLength={16}
                value={username}
                onChangeText= {setUserName}
                
                >

                </TextInput>
                <Pressable
                style = {styles.saveButton}
                onPress= {saveUserName}
               
                >
                    <Text style = {styles.saveButtonText}> SAVE </Text>
                </Pressable>
            </View>
            
        </View>
        </SafeAreaProvider>
        

    )

}

function createStyles(theme , colorScheme){
    return (StyleSheet.create({
        container:{
            flex:1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center'
        },
        title:{
            color: theme.textColor,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'SmoochSans',

        },
        input: {
            borderWidth: 2,
            borderColor: theme.iconColor,
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
            width: '100%',
            textAlign: 'center',
            color: theme.textColor

        },
        nameContainer:{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            alignItems: 'center',
        },
        saveButton:{
            marginTop: 20,
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
    
    }
    ))

}