import { useAppSelector } from "@/store"
import { getThemeStyle } from "@/utils/getThemeStyle"
import { View, ActivityIndicator, Platform } from "react-native"
import globalStyles from "@/styles/GlobalStyles";

export const LoadingIndicator = () => {
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  return (
    <View style={[globalStyles.background, themeBackgroundStyle, {alignItems: 'center', justifyContent: 'center'}]}>
      <ActivityIndicator 
        size={Platform.OS === "web" ? 55 : "large"} 
        color={colorScheme==="light" ? 'blue' : 'goldenrod'}
      />
    </View>
  )
}