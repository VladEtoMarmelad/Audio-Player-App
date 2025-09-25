import { View } from "react-native"
import { Directory, File, Paths } from 'expo-file-system';
import { useColorScheme } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store";
import { changeSessionState } from "@/features/sessionSlice";
import { useEffect } from "react";
import { ensureDirectoriesExist } from "@/utils/ensureDirectoriesExist";

interface ColorSchemeInfo {
  colorScheme: "light"|"dark";
  cachedColorScheme: "light"|"dark"|"system"; // colorScheme stored in app cache
}

const getColorSchema = (systemColorScheme: "light"|"dark"): ColorSchemeInfo => {
  try {
    const sessionInfoFile = new File(Paths.cache, "sessionInfo.txt")
    const sessionInfo = JSON.parse(sessionInfoFile.textSync())
    if (sessionInfo.colorScheme==="system") {
      return {
        colorScheme: systemColorScheme,
        cachedColorScheme: sessionInfo.colorScheme
      }
    } else {
      return {
        colorScheme: sessionInfo.colorScheme,
        cachedColorScheme: sessionInfo.colorScheme
      }
    }
  } catch (error) {
    console.error(error);
    return {
      colorScheme: "dark",
      cachedColorScheme: "dark"
    }
  }
}

export const SessionProvider = ({children}: any) => {
  const systemColorScheme = useColorScheme();
  const cachedColorScheme = useAppSelector(state => state.sessions.cachedColorScheme)
  const dispatch = useAppDispatch();

  useEffect(() => {
    ensureDirectoriesExist()
    const colorSchemeInfo = getColorSchema(systemColorScheme ?? "dark")
    dispatch(changeSessionState({fieldName: "colorScheme", fieldValue: colorSchemeInfo.colorScheme}))
    dispatch(changeSessionState({fieldName: "cachedColorScheme", fieldValue: colorSchemeInfo.cachedColorScheme}))
  }, [systemColorScheme, cachedColorScheme])

  return <View style={{flex: 1}}>{children}</View>
}