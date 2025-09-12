import { TouchableOpacity, Text, View, Image, TextInput, Platform, ActivityIndicator } from 'react-native';
import { BlurView } from "expo-blur";
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { pickAndReadAudioFile } from '@/utils/pickAndReadAudioFile';
import { pickImage } from '@/utils/pickImage';
import { ImageInfo } from '@/types/ImageInfo';
import { saveTrackToFileSystem } from '@/utils/saveTrackToFileSystem';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import globalStyles from '@/styles/GlobalStyles'

const AddTrack = () => {
  const [tags, setTags] = useState<any>(null);
  const [image, setImage] = useState<ImageInfo|null>(null)
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  let audioUri = useRef<string>("");

  useFocusEffect(
    useCallback(() => {
      return () => {
        setTags(null)
        setImage(null)
        setError("")
        setLoading(false)
        audioUri.current = ""
      }
    }, [])
  )

  const pickAndReadAudioFileHandler = async () => {
    setLoading(true)
    const result = await pickAndReadAudioFile()
    setTags(result.tags)
    setError(result.error)
    audioUri.current = result.fileUri
    setLoading(false)
  };

  const pickImageHandler = async () => {
    setLoading(true)
    const result = await pickImage()
    setImage(result)
    setLoading(false)
  }

  const saveTrackToFileSystemHandler = () => {
    const trackObject = {
      title: tags.title,
      album: tags.album,
      artist: tags.artist,

      audioUri: audioUri.current,
      imageUri: image ? image.imageUri : ""
    }
    saveTrackToFileSystem(trackObject)
  }

  return (
    <View style={{flex: 1}}>
      {loading && 
        <BlurView intensity={Platform.OS === "web" ? 10 : 1500} style={[globalStyles.blurContainer, {alignSelf: 'center', justifyContent: 'center'}]}>
          <ActivityIndicator size={36}/>
        </BlurView>
      }
      
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!tags &&
          <TouchableOpacity
            onPress={pickAndReadAudioFileHandler}
            style={[globalStyles.button, globalStyles.lightThemeButton, {flexDirection: 'row', alignItems: 'center'}]}
          >
            <FontAwesome6 name="file-audio" size={24} color="white"/>
            <Text style={{color: 'white', marginLeft: 10}}>Выбрать и прочитать аудио файл</Text>
          </TouchableOpacity>
        }
        
        {error ? <Text>{error}</Text> : null}
        {tags && (
          <View style={{width: '75%', flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={pickImageHandler}
              style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%'}}
            >
              {image ? 
                <Image
                  source={{uri: Platform.OS === "web" ? image.imageBase64 : `data:image/png;base64,${image.imageBase64}`}}
                  style={{width: 300, height: 300, borderRadius: 15}}
                />
                :
                <View style={{backgroundColor: 'black', borderRadius: 15, width: '100%'}}>
                  <MaterialIcons 
                    name="audiotrack" 
                    size={300}
                    color="white" 
                  />
                </View>
              }
            </TouchableOpacity>
            
            <TextInput 
              placeholder="Название..."
              value={tags.title}
              style={[globalStyles.input, globalStyles.lightThemeInput]}
            />
            <TextInput 
              placeholder="Исполнитель..."
              value={tags.artist}
              style={[globalStyles.input, globalStyles.lightThemeInput]}
            />
            <TextInput 
              placeholder="Альбом..."
              value={tags.album}
              style={[globalStyles.input, globalStyles.lightThemeInput]}
            />
            
            <TouchableOpacity
              onPress={saveTrackToFileSystemHandler}
              style={[globalStyles.button, globalStyles.lightThemeButton, {marginTop: 15}]}
            ><Text style={{color: 'white'}}>Сохранить трэк</Text></TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

export default AddTrack;