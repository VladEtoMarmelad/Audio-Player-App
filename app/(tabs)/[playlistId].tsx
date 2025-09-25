import { TouchableOpacity, View, Modal, Text } from "react-native";
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { useCallback, useState } from "react";
import { deleteFileFromDocumentDir } from "@/utils/deleteFileFromDocumentDir";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Playlist } from "@/types/Playlist";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { getPlaylistById } from "@/utils/getPlaylistById";
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from '@/styles/GlobalStyles'

const PlaylistScreen = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams()
  const playlistId = Array.isArray(searchParams.playlistId) ? searchParams.playlistId[0] : searchParams.playlistId

  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const [playlist, setPlaylist] = useState<Playlist|null>(null)
  const [showConfigureModal, setShowConfigureModal] = useState<boolean>(false)

  const deletePlaylistHandler = () => {
    deleteFileFromDocumentDir("playlists", playlistId)
    router.replace("/playlists")
  }

  useFocusEffect(
    useCallback(() => {
      setPlaylist(getPlaylistById(playlistId))
    }, [])
  )

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfigureModal}
        onRequestClose={() => setShowConfigureModal(!showConfigureModal)}
      >
        <View style={[globalStyles.modalView, themeModalViewStyle, {marginTop: 'auto', marginBottom: 50, alignSelf: 'center', width: '75%'}]}>
          <TouchableOpacity
            onPress={() => {}}
            style={{width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Редактировать</Text></TouchableOpacity>
          
          <TouchableOpacity
            onPress={deletePlaylistHandler}
            style={{width: '100%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить</Text></TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default PlaylistScreen;