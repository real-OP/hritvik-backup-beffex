import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function RootLayout() {
  return (
    <ThemeProvider>
    <Stack>
      <Stack.Screen  name = 'index'
      options={{headerTitle: 'Beffex',headerTintColor: 'white', headerStyle:{backgroundColor: 'rgb(41, 17, 70)'},
      headerLeft: () =>
      (<FontAwesome5 name="bell" size={24} color="white" style = {{marginLeft: 10 , marginRight: 6}} />) }}/>
      <Stack.Screen  name = 'name' options= {{}} />
    </Stack>
    </ThemeProvider>
    
  )
}
