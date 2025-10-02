import { Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer';
import { getAllTracks } from '@/utils/getAllTracks';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Track } from '@/types/Track';
import { useAppSelector, useAppDispatch } from '@/store';
import { changeSessionState } from '@/features/sessionSlice';
import { getThemeStyle } from '@/utils/getThemeStyle';
import { File, Paths } from 'expo-file-system';
import { deleteFileFromDocumentDir } from '@/utils/deleteFileFromDocumentDir';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import globalStyles from '@/styles/GlobalStyles'
import { TrackItem } from '@/components/TrackItem';

global.Buffer = Buffer;

export default function Index() {
  const [tracks, setTracks] = useState<Track[]|null>(null);
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showColorThemeModal, setShowColorThemeModal] = useState<boolean>(false)
  const [selectedTrack, setSelectedTrack] = useState<any>(null)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const cachedColorScheme = useAppSelector(state => state.sessions.cachedColorScheme)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useFocusEffect(
    useCallback(() => {
      const getAndUseTracks = async (): Promise<void> => {
        let result = await getAllTracks(true)
        setTracks(result)
      }
      getAndUseTracks()
    }, [])
  )

  const deleteTrackHandler = (): void => {
    deleteFileFromDocumentDir("tracks", selectedTrack.id)
    setTracks((prevTracks: any) => prevTracks.filter((track: any) => track.title!==selectedTrack.title))
    setShowDeleteModal(false)
  }

  const redirectToTrackUpdateScreen = (): void => {
    const track = tracks?.find((track: any) => track.title===selectedTrack.title)

    setShowModal(false)
    setSelectedTrack(null)

    router.push({
      pathname: "/saveTrack", 
      params: {defaultTrackInfo: JSON.stringify({
        tags: {
          id: track?.id,
          title: track?.title,
          artist: track?.artist,
          album: track?.album
        },
        imageUri: track?.imageUri, 
        audioUri: track?.audioUri
      })}
    })
  }

  const changeColorSchemeHandler = (newColorScheme: "light"|"dark"|"system") => {
    try { //update colorScheme in app cache
      const sessionInfoFile = new File(Paths.cache, "sessionInfo.txt")
      sessionInfoFile.write(JSON.stringify({
        colorScheme: newColorScheme
      }))
    } catch (error: unknown) {
      console.error(error)
    }

    dispatch(changeSessionState({fieldName: "cachedColorScheme", fieldValue: newColorScheme}))
  }

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeModalViewStyle = getThemeStyle(colorScheme, globalStyles, "ModalView")

  return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      <TouchableOpacity
        onPress={() => setShowColorThemeModal(!showColorThemeModal)}
        style={{position: 'absolute', top: 25, right: 25}}
      >
        <FontAwesome6 name="circle-half-stroke" size={24} color={colorScheme==="light" ? 'black' : 'white'} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showColorThemeModal}
        onRequestClose={() => setShowColorThemeModal(!showColorThemeModal)}
      >
        <View style={[globalStyles.modalView, themeModalViewStyle, {position: 'absolute', top: 25, right: 25}]}>
          <TouchableOpacity
            onPress={() => changeColorSchemeHandler("system")}
            style={{backgroundColor: cachedColorScheme==="system" ? '#696969' : undefined, padding: 15,  borderTopLeftRadius: 15, borderTopRightRadius: 15}}
          >
            <FontAwesome6 name="circle-half-stroke" size={24} color={colorScheme==="light" ? 'black' : 'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => changeColorSchemeHandler("light")}
            style={{backgroundColor: cachedColorScheme==="light" ? '#a9a9a9' : undefined, padding: 15}}
          >
            <Entypo name="light-up" size={24} color={colorScheme==="light" ? 'black' : 'white'} />  
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => changeColorSchemeHandler("dark")}
            style={{backgroundColor: cachedColorScheme==="dark" ? '#696969' : undefined, padding: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}
          >
            <Entypo name="moon" size={24} color={colorScheme==="light" ? 'black' : 'white'} />  
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 15}}>
        <View style={{flexDirection: 'row', marginTop: 50}}>
          <Link
            href="/saveTrack"
            style={{backgroundColor: 'darkgray', borderRadius: 15, width: 125, height: 70, padding: 10}}
          >
            <View>
              <Text style={{fontSize: 24, fontWeight: 'bold'}}>+</Text>
              <Text style={{fontSize: 12, fontWeight: 'bold'}}>Добавить трэк</Text>
            </View>
          </Link>

          <Link
            href="/playlists"
            style={{backgroundColor: 'darkgray', borderRadius: 15, width: 125, height: 70, padding: 10, marginLeft: 5}}
          >
            <View>
              <MaterialCommunityIcons name="playlist-music" size={24} color="black" />
              <Text style={{fontSize: 12, fontWeight: 'bold'}}>Плэйлисты</Text>
            </View>
          </Link>
        </View>
        
        <FlatList 
          data={tracks}
          keyExtractor={track => track.id ? track.id : track.title}
          renderItem={({item: track}) => 
            <Link 
              href={{
                pathname: "/track/[trackId]",
                params: {trackId: track.id ?? track.title}
              }}
              style={{marginTop: 15}}
            >
              <TrackItem 
                track={track} 
                setShowModal={setShowModal} 
                setSelectedTrack={setSelectedTrack}
              />
            </Link>
          }
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(!showModal)}
        >
          <View style={[globalStyles.modalView, themeModalViewStyle, {marginTop: 'auto', marginBottom: 50, alignItems: 'flex-start', alignSelf: 'center', width: '75%'}]}>
            <TouchableOpacity
              onPress={redirectToTrackUpdateScreen}
              style={{width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
            ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Редактировать</Text></TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowDeleteModal(true);
                setShowModal(false)
              }}
              style={{width: '100%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
            ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить</Text></TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(!showDeleteModal)}
        >
          <View style={[globalStyles.modalView, themeModalViewStyle, {marginTop: 'auto', marginBottom: 50, alignItems: 'flex-start', alignSelf: 'center', width: '75%'}]}>
            <View style={{width: '100%'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Удалить</Text>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить песню "{selectedTrack?.title}"</Text>
            </View>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                style={[globalStyles.button, {backgroundColor: 'darkgray'}]}
              ><Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Отмена</Text></TouchableOpacity>

              <TouchableOpacity
                onPress={deleteTrackHandler}
                style={[globalStyles.button, {backgroundColor: 'red'}]}
              ><Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Удалить</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
