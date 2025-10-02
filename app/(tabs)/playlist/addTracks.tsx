import { FlatList, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { TrackCheckbox } from "@/components/TrackCheckbox";
import { getIDsFromDocumentDir } from "@/utils/getIDsFromDocumentDir";
import { File, Paths } from "expo-file-system";
import { Playlist } from "@/types/Playlist";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { useAppSelector } from "@/store";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/GlobalStyles";

const AddTracksToPlaylist = () => {
  const [trackIDs, setTrackIDs] = useState<string[]|null>(null);
  const [playlistTrackIDs, setPlaylistTrackIDs] = useState<string[]|null>(null);
  const selectedTrackIDs = useRef<string[]>([]);
  const router = useRouter();
  const navigation = useNavigation();
  const searchParams = useLocalSearchParams();
  const playlistId = Array.isArray(searchParams.playlistId) ? searchParams.playlistId[0] : searchParams.playlistId

  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  useFocusEffect(
    useCallback(() => {
      setTrackIDs(getIDsFromDocumentDir("tracks"))

      try {
        const playlistFile = new File(Paths.document, "playlists", `${playlistId}.txt`)
        const playlist: Playlist = JSON.parse(playlistFile.textSync())
        setPlaylistTrackIDs(playlist.tracksIDs)
      } catch (error: unknown) {
        console.error("Error while updating playlist tracksIDs:", error)
        setPlaylistTrackIDs([])
      }
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => { // update playlist tracksIDs
            try {
              const playlistFile = new File(Paths.document, "playlists", `${playlistId}.txt`)
              const playlist: Playlist = JSON.parse(playlistFile.textSync())
              playlist.tracksIDs = selectedTrackIDs.current
              playlistFile.write(JSON.stringify(playlist))
              router.replace({
                pathname: "/playlist/[playlistId]",
                params: {playlistId: playlistId}
              })
            } catch (error: unknown) {
              console.error("Error while updating playlist tracksIDs:", error)
            }
          }}>
            <MaterialIcons name="check" size={28} style={themeTextStyle} />
          </TouchableOpacity>   
        )
      });
    }, [navigation])
  );

  if (!trackIDs || !playlistTrackIDs) return <LoadingIndicator />

  return (
    <View style={globalStyles.background}>  
      <FlatList 
        data={trackIDs}
        keyExtractor={trackId => trackId}
        style={{marginHorizontal: 15}}
        renderItem={({item: trackId}) => 
          <TrackCheckbox 
            trackId={trackId}
            playlistTrackIDs={playlistTrackIDs} 
            addToSelectedTrackIds={(trackId: string) => selectedTrackIDs.current.push(trackId)}
            deleteFromSelectedTrackIds={(trackId: string) => {
              const trackIdIndex: number = selectedTrackIDs.current.indexOf(trackId)
              selectedTrackIDs.current.splice(trackIdIndex, 1)
            }}
          />
        }
      />
    </View>
  )
}

export default AddTracksToPlaylist;