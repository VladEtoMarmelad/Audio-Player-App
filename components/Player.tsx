import { View, TouchableOpacity, Text } from "react-native"
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import { secondsToTime } from "@/utils/secondsToTime";
import { getIDsFromDocumentDir } from "@/utils/getIDsFromDocumentDir";
import Slider from "@react-native-community/slider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import playerStyles from "@/styles/PlayerStyles"

export const Player = ({audioBase64}: {audioBase64: string}) => {
  const [afterFinish, setAfterFinish] = useState<"repeat"|"nextTrack"|"randomTrack">("repeat")
  const player = useAudioPlayer(`data:audio/mp3;base64,${audioBase64}`)
  const playerStatus = useAudioPlayerStatus(player)

  const router = useRouter()
  const searchParams = useLocalSearchParams()
  const trackId = Array.isArray(searchParams.trackId) ? searchParams.trackId[0] : searchParams.trackId
  const initialAfterFinish: any = Array.isArray(searchParams.initialAfterFinish) ? searchParams.initialAfterFinish[0] : searchParams.initialAfterFinish
  const playlistTrackIDs: string|undefined = Array.isArray(searchParams.playlistTrackIDs) ? searchParams.playlistTrackIDs[0] : searchParams.playlistTrackIDs
  let nextTracksIDs = useRef<string[]>([trackId]) //contains IDs of tracks that can be played 

  useFocusEffect(
    useCallback(() => {
      if (playlistTrackIDs) {
        nextTracksIDs.current = JSON.parse(playlistTrackIDs)
      } else {
        nextTracksIDs.current = getIDsFromDocumentDir("tracks")
      }
      
      setAfterFinish(initialAfterFinish ?? "repeat") //using afterFinish that was choosed in prev track
      
      player.play()
    }, [trackId, initialAfterFinish])
  )
  
  const redirectToNextTrack = () => {
    const getNextTrackId = (): string => {
      const currentTrackIndex = nextTracksIDs.current.indexOf(trackId)

      if (currentTrackIndex===nextTracksIDs.current.length-1) { // if last track 
        return nextTracksIDs.current[0] // first track
      } else {
        return nextTracksIDs.current[currentTrackIndex+1] // next track
      }
    }

    router.replace({
      pathname: "/track/[trackId]",
      params: {
        trackId: getNextTrackId(),
        initialAfterFinish: afterFinish,
        playlistTrackIDs
      }
    })
  }

  const redirectToPreviousTrack = () => {
    const getPreviousTrackId = (): string => {
      const currentTrackIndex = nextTracksIDs.current.indexOf(trackId)

      if (currentTrackIndex===0) { // if first track 
        return nextTracksIDs.current[nextTracksIDs.current.length-1] // last track
      } else {
        return nextTracksIDs.current[currentTrackIndex-1] // prev track
      }
    }

    router.replace({
      pathname: "/track/[trackId]",
      params: {
        trackId: getPreviousTrackId(),
        initialAfterFinish: afterFinish,
        playlistTrackIDs
      }
    })
  }

  useEffect(() => {
    if (playerStatus.didJustFinish) {
      if (afterFinish==="repeat") {
        player.seekTo(0)
      } else if (afterFinish==="nextTrack") {
        redirectToNextTrack()
      } else {
        const otherTracksIDs: string[] = nextTracksIDs.current.filter((id: string) => id!==trackId) // ids of all tracks except current track
        const randomTrackId: string = otherTracksIDs[Math.floor(Math.random() * otherTracksIDs.length)]
        console.log("randomTrackId:", randomTrackId)
        router.replace({
          pathname: "/track/[trackId]",
          params: {
            trackId: randomTrackId,
            initialAfterFinish: afterFinish,
            playlistTrackIDs
          }
        })
      }
    }
  }, [playerStatus])

  const changeAfterFinish = () => {
    if (afterFinish==="repeat") {
      setAfterFinish("nextTrack")
    } else if (afterFinish==="nextTrack") {
      setAfterFinish("randomTrack")
    } else {
      setAfterFinish("repeat")
    }
  }

  return (
    <View>
      <View style={{width: '100%', marginTop: 15}}>
        <Slider 
          style={{flex: 1, width: 300, borderRadius: 50}}
          value={Math.trunc(playerStatus.currentTime)}
          onValueChange={(e) => {
            player.pause()
            player.seekTo(e)
            player.play()
          }}
          minimumValue={0}
          maximumValue={playerStatus.duration}
          step={1}
          thumbTintColor="#bbbbbb"
          minimumTrackTintColor="#bbbbbb"
          maximumTrackTintColor="darkgray"
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 15}}>
          <Text style={{color: 'white'}}>{secondsToTime(Math.trunc(playerStatus.currentTime))}</Text>
          <Text style={{color: 'white'}}>{secondsToTime(Math.trunc(playerStatus.duration))}</Text>
        </View>
      </View>
      
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <TouchableOpacity
          onPress={redirectToPreviousTrack}
          style={{alignSelf: 'center'}}
        >
          <MaterialIcons name="skip-previous" size={36} color={nextTracksIDs.current.length>=0 ? "white" : "gray"} />
        </TouchableOpacity>

        {playerStatus.timeControlStatus === "playing" ?
          <TouchableOpacity
            onPress={() => player.pause()}
            style={playerStyles.pauseButton}
          ><FontAwesome6 name="pause" size={24} color="white" /></TouchableOpacity>
          :
          <TouchableOpacity
            onPress={() => player.play()}
            style={playerStyles.pauseButton}
          ><FontAwesome6 name="play" size={24} color="white" /></TouchableOpacity>
        }

        <TouchableOpacity
          onPress={redirectToNextTrack}
          style={{alignSelf: 'center'}}
        >
          <MaterialIcons name="skip-next" size={36} color={nextTracksIDs.current.length>=0 ? "white" : "gray"} />
        </TouchableOpacity>
      </View>
      

      <TouchableOpacity
        onPress={changeAfterFinish}
        style={{padding: 15}}
      >
        {
          afterFinish === "repeat" &&
          <MaterialIcons name="repeat-one" size={24} color="white" />
          
          || afterFinish === "nextTrack" && 
          <MaterialIcons name="repeat" size={24} color="white" />

          || afterFinish === "randomTrack" &&
          <FontAwesome name="random" size={24} color="white" />
        }
        
      </TouchableOpacity>
    </View>
  )
}