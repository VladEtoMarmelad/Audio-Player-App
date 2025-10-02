import { TouchableOpacity, View, Modal, Text, Image, FlatList } from "react-native";
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { useCallback, useState } from "react";
import { deleteFileFromDocumentDir } from "@/utils/deleteFileFromDocumentDir";
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Playlist } from "@/types/Playlist";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { getPlaylistById } from "@/utils/getPlaylistById";
import { TrackItem } from "@/components/TrackItem";
import { getTrackById } from "@/utils/getTrackById";
import { File, Paths } from "expo-file-system";
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from '@/styles/GlobalStyles'

const PlaylistScreen = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams()
  const playlistId = Array.isArray(searchParams.playlistId) ? searchParams.playlistId[0] : searchParams.playlistId
  
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const [playlist, setPlaylist] = useState<Playlist|null>(null)
  const [showConfigureModal, setShowConfigureModal] = useState<boolean>(false)

  const [selectedTrack, setSelectedTrack] = useState<any>(null) 
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)
  const [showDeleteTrackModal, setShowDeleteTrackModal] = useState<boolean>(false)

  const deletePlaylistHandler = () => {
    deleteFileFromDocumentDir("playlists", playlistId)
    router.replace("/playlists")
  }

  useFocusEffect(
    useCallback(() => {
      setPlaylist(getPlaylistById(playlistId))
    }, [])
  )

  const redirectToTrackUpdateScreen = (): void => {
    const track = getTrackById(selectedTrack.id)

    setShowTrackModal(false)
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

  const deleteTrackFromPlaylist = (): void => {
    const playlistFile = new File(Paths.document, "playlists", `${playlistId}.txt`)
    const playlist: Playlist = JSON.parse(playlistFile.textSync())
    playlist.tracksIDs = playlist.tracksIDs.filter((trackId) => trackId!==selectedTrack.id)
    playlistFile.write(JSON.stringify(playlist))

    setPlaylist((prevPlaylist: Playlist|null) => {
      if (!prevPlaylist) return null;
      return {
        ...prevPlaylist, 
        tracks: prevPlaylist.tracks?.filter((track) => track.id!==selectedTrack.id)
      }
    })
  }

  const deleteTrackHandler = (): void => {
    deleteFileFromDocumentDir("tracks", selectedTrack.id)
    deleteTrackFromPlaylist()

    setShowDeleteTrackModal(false)
  }

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeModalViewStyle = getThemeStyle(colorScheme, globalStyles, "ModalView")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  if (!playlist) return <LoadingIndicator />

  return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      <TouchableOpacity
        onPress={() => setShowConfigureModal(!showConfigureModal)}
        style={{position: 'absolute', top: 30, right: 30}}
      >
        <Entypo name="dots-three-vertical" size={24} style={themeTextStyle} />
      </TouchableOpacity>

      <View style={{flex: 1, alignItems: 'center'}}>
        <Image 
          source={{uri: `data:image/png;base64,${playlist.image}`}}
          style={{width: 150, height: 150, marginTop: 100, borderRadius: 15}}
        />
        <Text style={{marginTop: 15, fontSize: 18, fontWeight: 'bold', color: 'white'}}>{playlist.title}</Text>

        <FlatList 
          data={playlist.tracks}
          keyExtractor={track => track.id ?? track.title}
          style={{marginHorizontal: 15}}
          renderItem={({item: track}) => 
            <Link 
              href={{
                pathname: "/track/[trackId]", 
                params: {
                  trackId: track.id ?? "",
                  playlistTrackIDs: JSON.stringify(playlist.tracksIDs)
                }
              }}
              style={{marginTop: 15}}
            >
              <TrackItem 
                track={track}
                setShowModal={setShowTrackModal}
                setSelectedTrack={setSelectedTrack}
              />
            </Link>
          }
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfigureModal}
        onRequestClose={() => setShowConfigureModal(!showConfigureModal)}
      >
        <View style={[globalStyles.modalView, themeModalViewStyle, {marginTop: 'auto', marginBottom: 50, alignSelf: 'center', width: '75%'}]}>
          <TouchableOpacity
            onPress={() => router.replace({pathname: "/playlist/addTracks", params: {playlistId: playlistId}})}
            role="link"
            style={{width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Добавить треки</Text></TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={{width: '100%', padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Редактировать</Text></TouchableOpacity>
          
          <TouchableOpacity
            onPress={deletePlaylistHandler}
            style={{width: '100%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить</Text></TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showTrackModal}
        onRequestClose={() => setShowTrackModal(!showTrackModal)}
      >
        <View style={[globalStyles.modalView, themeModalViewStyle, {marginTop: 'auto', marginBottom: 50, alignItems: 'flex-start', alignSelf: 'center', width: '75%'}]}>
          <TouchableOpacity
            onPress={deleteTrackFromPlaylist}
            style={{width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Убрать из плейлиста</Text></TouchableOpacity>

          <TouchableOpacity
            onPress={redirectToTrackUpdateScreen}
            style={{width: '100%', padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Редактировать</Text></TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowDeleteTrackModal(true);
              setShowTrackModal(false)
            }}
            style={{width: '100%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить</Text></TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteTrackModal}
        onRequestClose={() => setShowDeleteTrackModal(!showDeleteTrackModal)}
        >
          <View style={[globalStyles.modalView, themeModalViewStyle, {marginTop: 'auto', marginBottom: 50, alignItems: 'flex-start', alignSelf: 'center', width: '75%'}]}>
            <View style={{width: '100%'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Удалить</Text>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить песню "{selectedTrack?.title}"</Text>
            </View>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => setShowDeleteTrackModal(false)}
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
  )
}

export default PlaylistScreen;