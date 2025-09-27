import { FlatList, TouchableOpacity, View, Text, Image } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getAllPlaylists } from "@/utils/getAllPlaylists";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { useAppSelector } from "@/store";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Playlist } from "@/types/Playlist";
import { AddPlaylistModal } from "@/components/AddPlaylistModal";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import globalStyles from '@/styles/GlobalStyles'

const Playlists = () => {
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const [playlists, setPlaylists] = useState<Playlist[]|null>(null)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      setPlaylists(getAllPlaylists())
    }, [])
  )

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  if (!playlists) return <LoadingIndicator />

  return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      <TouchableOpacity
        onPress={() => setShowAddModal(!showAddModal)}
        style={{position: 'absolute', top: 50, right: 25}}
      >
        <MaterialCommunityIcons name="playlist-plus" size={24} style={themeTextStyle} />
      </TouchableOpacity>

      <View style={{justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 15, marginTop: 100}}>
        <FlatList 
          data={playlists}
          keyExtractor={playlist => playlist.id ? playlist.id : playlist.title}
          numColumns={2}
          renderItem={({item: playlist}) => 
            <Link 
              href={{
                pathname: "/playlist/[playlistId]",
                params: {trackId: playlist.id ?? playlist.title}
              }}
              style={{marginTop: 15}}
            >
              <View>
                {playlist.image!=="" && 
                  <Image
                    source={{uri: `data:image/png;base64,${playlist.image ?? ""}`}}
                    style={{width: 150, height: 150, borderRadius: 10}}
                  />
                }
                <View style={{marginLeft: 10}}>
                  <Text style={themeTextStyle}>{playlist.title.slice(0, 40)}{playlist.title.length>40&&"..."}</Text>
                </View>
              </View>
            </Link>
          }
        />
      </View>

      <AddPlaylistModal showAddModal={showAddModal} setShowAddModal={setShowAddModal}/>
    </View>
  )
}

export default Playlists;