import { TouchableOpacity, Text, View, Image, TextInput, Platform, ActivityIndicator } from 'react-native';
import { BlurView } from "expo-blur";
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { pickAndReadAudioFile } from '@/utils/pickAndReadAudioFile';
import { getThemeStyle } from '@/utils/getThemeStyle';
import { useAppSelector } from '@/store';
import { ImagePicker } from '@/components/ImagePicker';
import { saveFileToDocumentDir } from '@/utils/saveFileToDocumentDir';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import globalStyles from '@/styles/GlobalStyles'

const SaveTrack = () => {
  const imageUri = useRef<string|null>("")
  const [tags, setTags] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const { defaultTrackInfo } = useLocalSearchParams(); //provided only when screen used to update file
  const colorScheme = useAppSelector(state => state.sessions.colorScheme);
  const router = useRouter();
  let audioUri = useRef<string>("");

  useFocusEffect(
    useCallback(() => {
      const getAndUseTrackInfo = async (): Promise<void> => {
        if (defaultTrackInfo && typeof defaultTrackInfo==="string") {
          const parsedDefaultTrackInfo = JSON.parse(defaultTrackInfo)
          setTags(parsedDefaultTrackInfo.tags)
          audioUri.current = parsedDefaultTrackInfo.audioUri
        }
      }
      getAndUseTrackInfo()

      return () => {
        setTags(null)
        setError("")
        setLoading(false)
        audioUri.current = ""
      }
    }, [defaultTrackInfo])
  )

  const pickAndReadAudioFileHandler = async () => {
    setLoading(true)
    const result = await pickAndReadAudioFile()
    setTags(result.tags)
    setError(result.error)
    audioUri.current = result.fileUri
    setLoading(false)
  };

  const saveTrackToFileSystemHandler = async () => {
    const trackObject = {
      id: tags.id,
      title: tags.title,
      album: tags.album,
      artist: tags.artist,

      audioUri: audioUri.current,
      imageUri: imageUri.current ?? ""
    }

    saveFileToDocumentDir("tracks", trackObject)

    router.push("/")
  }

  const setTagsField = (fieldName: string, fieldValue: any): void => {
    setTags((prevTags: any) => ({
      ...prevTags,
      [fieldName]: fieldValue
    }))
  }

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
  const themeInputStyle = getThemeStyle(colorScheme, globalStyles, "Input")

  return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      {loading && 
        <BlurView intensity={Platform.OS === "web" ? 10 : 1500} style={[globalStyles.blurContainer, {alignSelf: 'center', justifyContent: 'center'}]}>
          <ActivityIndicator size={36}/>
        </BlurView>
      }
      
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!tags &&
          <TouchableOpacity
            onPress={pickAndReadAudioFileHandler}
            style={[globalStyles.button, themeButtonStyle, {flexDirection: 'row', alignItems: 'center'}]}
          >
            <FontAwesome6 name="file-audio" size={24} color="white"/>
            <Text style={{color: 'white', marginLeft: 10}}>Выбрать и прочитать аудио файл</Text>
          </TouchableOpacity>
        }
        
        {error ? <Text>{error}</Text> : null}
        {tags && (
          <View style={{width: '75%', flex: 1, justifyContent: 'center'}}>
            <ImagePicker setImage={(value: string|null) => imageUri.current = value}/>
            
            <TextInput 
              placeholder="Название..."
              value={tags.title}
              onChangeText={(e) => setTagsField("title", e)}
              style={[globalStyles.input, themeInputStyle]}
            />
            <TextInput 
              placeholder="Исполнитель..."
              value={tags.artist}
              onChangeText={(e) => setTagsField("artist", e)}
              style={[globalStyles.input, themeInputStyle]}
            />
            <TextInput 
              placeholder="Альбом..."
              value={tags.album}
              onChangeText={(e) => setTagsField("album", e)}
              style={[globalStyles.input, themeInputStyle]}
            />
            
            <TouchableOpacity
              onPress={saveTrackToFileSystemHandler}
              style={[globalStyles.button, themeButtonStyle, {marginTop: 15}]}
            ><Text style={{color: 'white'}}>Сохранить трэк</Text></TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

export default SaveTrack;