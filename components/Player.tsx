import { View, TouchableOpacity } from "react-native"
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import Slider from "@react-native-community/slider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import playerStyles from "@/styles/PlayerStyles"

export const Player = ({audioBase64}: any) => {

  const player = useAudioPlayer(`data:audio/mp3;base64,${audioBase64}`)
  const playerStatus = useAudioPlayerStatus(player)
  console.log(playerStatus)
  
  useFocusEffect(
    useCallback(() => {
      player.play()
    }, [])
  )
  
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
    </View>
  )
}