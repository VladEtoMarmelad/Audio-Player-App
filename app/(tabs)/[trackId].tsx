import { View, Text, Image } from "react-native";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
import { useCallback, useState } from "react";
import { getTrackById } from "@/utils/getTrackById";
import { Player } from "@/components/Player";
import { Track } from "@/types/Track";
import { LoadingIndicator } from "@/components/LoadingIndicator";
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

  if (loading || !track) return <LoadingIndicator />

  return (
    <View style={globalStyles.background}>
      {track.image && 
        <Image
          source={{uri: `data:image/png;base64,${track.image}`}}
          style={{flex: 1, width: '100%', height: '100%', position: 'absolute'}}
        />
      }
      <BlurView 
        tint="dark"
        intensity={1000}
        style={[globalStyles.background, {alignItems: 'center', justifyContent: 'center'}]}
      >
        <Link
          href="/"
          style={{position: 'absolute', top: 15, left: 15}}
        >
          <MaterialIcons name="chevron-left" size={36} color="white" />
        </Link>

        <View>
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
          <Text style={{alignSelf: 'flex-start', fontSize: 20, fontWeight: '500', color: 'white'}}>{track.title}</Text>
          <Text style={{alignSelf: 'flex-start', color: 'gray'}}>{track.artist}</Text>
        </View>
        
        <Player audioBase64={track.audio ?? ""} />
      </BlurView>
    </View>
  )
}

export default TrackScreen;