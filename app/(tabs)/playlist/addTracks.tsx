import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrackCheckbox } from "@/components/TrackCheckbox";
import { getIDsFromDocumentDir } from "@/utils/getIDsFromDocumentDir";
import globalStyles from "@/styles/GlobalStyles";

const AddTracksToPlaylist = () => {
  const [trackIDs, setTrackIDs] = useState<string[]|null>(null)
  const selectedTrackIDs = useRef<string[]>([])

  useFocusEffect(
    useCallback(() => {
      setTrackIDs(getIDsFromDocumentDir("tracks"))
    }, [])
  )

  useEffect(() => {
    console.log("selectedTrackIDs:", selectedTrackIDs.current)
  }, [selectedTrackIDs.current])

  return (
    <View style={globalStyles.background}>  
      <FlatList 
        data={trackIDs}
        keyExtractor={trackId => trackId}
        style={{marginHorizontal: 15}}
        renderItem={({item: trackId}) => 
          <TrackCheckbox 
            trackId={trackId} 
            addToSelectedTrackIds={(trackId: string) => selectedTrackIDs.current.push(trackId)}
            deleteFromSelectedTrackIds={(trackId: string) => {
              const trackIdIndex: number = selectedTrackIDs.current.indexOf(trackId)
              selectedTrackIDs.current.splice(trackIdIndex, 1)
            }}
          />
        }
      />

      <TouchableOpacity
        onPress={() => console.log("selectedTrackIDs:", selectedTrackIDs.current)}
        style={{alignSelf: 'center', marginBottom: 100}}
      >
        <Text style={{color: 'white'}}>console.log all trackIDs choosed to adding to playlist</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddTracksToPlaylist;