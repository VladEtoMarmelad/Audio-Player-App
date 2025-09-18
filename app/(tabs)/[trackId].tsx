import { View, Text, Image, ActivityIndicator } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { getTrackById } from "@/utils/getTrackById";
import { Player } from "@/components/Player";
import { Track } from "@/types/Track";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import globalStyles from '@/styles/GlobalStyles'

const TrackScreen = () => {
  const [track, setTrack] = useState<Track|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const searchParams = useLocalSearchParams()
  const trackId = Array.isArray(searchParams.trackId) ? searchParams.trackId[0] : searchParams.trackId

  useFocusEffect(
    useCallback(() => {
      const getAndUseTrack = async () => {
        setTrack(await getTrackById(trackId))
        setLoading(false)
      }
      getAndUseTrack()

      return () => {
        setTrack(null)
        setLoading(true)
      }
    }, [trackId])
  )

  if (loading || !track) return (
    <View style={[globalStyles.blurContainer, {flex: 1, alignSelf: 'center', justifyContent: 'center'}]}>
      <ActivityIndicator size={36}/>
    </View>
  )

  return (
    <View style={[globalStyles.background, globalStyles.lightThemeBackground, {alignItems: 'center', justifyContent: 'center'}]}>
      {track.image ? 
        <Image
          source={{uri: `data:image/png;base64,${track.image}`}}
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
      <Text>{track.title}</Text>
      <Text>{track.artist}</Text>

      <Player audioBase64={track.audio ?? ""} />
    </View>
  )
}

export default TrackScreen;