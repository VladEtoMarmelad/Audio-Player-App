import { View, TouchableOpacity } from "react-native"
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import { documentDirectory, readDirectoryAsync } from 'expo-file-system/legacy';
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
  let allTracksIDs = useRef<string[]>([trackId])

  useFocusEffect(
    useCallback(() => {
      const getAndUseAllTracksIDs = async (): Promise<void> => {
        const tracksDirectory = documentDirectory + "tracks"
        allTracksIDs.current = await readDirectoryAsync(tracksDirectory) 
      } 
      getAndUseAllTracksIDs()
      player.play()
    }, [trackId])
  )
  
  useEffect(() => {
    if (playerStatus.didJustFinish) {
      if (afterFinish==="repeat") {
        player.seekTo(0)
      } else if (afterFinish==="nextTrack") {
        console.log(`afterFinish==="nextTrack"`)
        const getNextTracksId = (): string => {
          const currentTrackIndex = allTracksIDs.current.indexOf(trackId)

          if (currentTrackIndex===allTracksIDs.current.length-1) { // if last track 
            return allTracksIDs.current[0] // first track
          } else {
            return allTracksIDs.current[currentTrackIndex+1] // next track
          }
        }
        console.log("getNextTracksId():", getNextTracksId())

        router.push({
          pathname: "/[trackId]",
          params: {trackId: getNextTracksId()}
        })
      } else {
        console.log(`afterFinish==="random"`)
        const otherTracksIDs: string[] = allTracksIDs.current.filter((id: string) => id!==trackId) // ids of all tracks except current track
        const randomTrackId: string = otherTracksIDs[Math.floor(Math.random() * otherTracksIDs.length)]
        console.log("randomTrackId:", randomTrackId)
        router.push({
          pathname: "/[trackId]",
          params: {trackId: randomTrackId}
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
      <Slider 
        style={{width: 300, height: 50, borderRadius: 50}}
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

      {playerStatus.timeControlStatus === "playing" ?
        <TouchableOpacity
          onPress={() => player.pause()}
          style={playerStyles.pauseButton}
        ><FontAwesome6 name="pause" size={24} color="black" /></TouchableOpacity>
        :
        <TouchableOpacity
          onPress={() => player.play()}
          style={playerStyles.pauseButton}
        ><FontAwesome6 name="play" size={24} color="black" /></TouchableOpacity>
      }

      <TouchableOpacity
        onPress={changeAfterFinish}
        style={{padding: 15}}
      >
        {
          afterFinish === "repeat" &&
          <MaterialIcons name="repeat-one" size={24} color="black" />
          
          || afterFinish === "nextTrack" && 
          <MaterialIcons name="repeat" size={24} color="black" />

          || afterFinish === "randomTrack" &&
          <FontAwesome name="random" size={24} color="black" />
        }
        
      </TouchableOpacity>
    </View>
  )
}