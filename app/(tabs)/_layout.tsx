import { Platform } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      tabBarPosition: Platform.OS === "web" ? "left" : "bottom",
      tabBarActiveTintColor: 'blue', 
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="addTrack"
        options={{href: null}}
      />
    </Tabs>
  )
}
