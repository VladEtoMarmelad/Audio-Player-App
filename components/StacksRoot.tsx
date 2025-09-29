import { Stack, useRouter } from "expo-router"
import { useAppSelector } from "@/store"
import { getThemeStyle } from "@/utils/getThemeStyle"
import { TouchableOpacity } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/GlobalStyles"

export const StacksRoot = () => {
  const router = useRouter()
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  return (
    <Stack 
      screenOptions={{
        animation: "slide_from_bottom",
        headerStyle: themeBackgroundStyle,
        contentStyle: themeBackgroundStyle,
        headerShadowVisible: false,
        headerTitleStyle: {
          color: colorScheme==="dark" ? 'white' : 'black',
          fontSize: 18
        },
        headerTitleAlign: "center",
        headerLeft: ({ canGoBack }) => {
          if (canGoBack) {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialIcons name="chevron-left" size={36} style={themeTextStyle} />
              </TouchableOpacity>
            )
          }
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{headerShown: false}}
      />
      
      <Stack.Screen 
        name="track/[trackId]"
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="saveTrack"
        options={{title: ""}}
      />

      <Stack.Screen 
        name="playlists"
        options={{title: "Плэйлисты"}}
      />
      <Stack.Screen 
        name="playlist/[playlistId]"
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="playlist/addTracks"
        options={{title: "Добавить треки"}}
      />
    </Stack>
  )
}