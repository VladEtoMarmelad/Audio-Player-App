import { View, TouchableOpacity, Image, Text } from "react-native"
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { Track } from "@/types/Track";
import { getTrackById } from "@/utils/getTrackById";
import globalStyles from "@/styles/GlobalStyles";

interface TrackCheckboxProps {
  trackId: string;
  addToSelectedTrackIds: (trackId: string) => void;
  deleteFromSelectedTrackIds: (trackId: string) => void
}

export const TrackCheckbox = ({trackId, addToSelectedTrackIds, deleteFromSelectedTrackIds}: TrackCheckboxProps) => {
  const [track, setTrack] = useState<Track|null>(null)
  const [checked, setChecked] = useState<boolean>(false);
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  useEffect(() => {
    setTrack(getTrackById(trackId, true))
  }, [])

  useEffect(() => {
    if (checked) {
      addToSelectedTrackIds(trackId)
    } else {
      deleteFromSelectedTrackIds(trackId)
    }
  }, [checked])

  if (!track) return <Text style={themeTextStyle}>Загрузка...</Text>

  return (
    <View 
      style={{
        flexDirection: 'row', 
        marginTop: 15,
        padding: 10,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: checked ? 'lightgray' : undefined
      }}
    > 
      <Checkbox 
        value={checked} 
        onValueChange={setChecked} 
        style={{marginTop: 15}}
      />
      <TouchableOpacity 
        onPress={() => setChecked(!checked)}
        style={{flexDirection: 'row', alignItems: 'center', width: '100%', marginLeft: 10}}
      >
        {track.image!=="" && 
          <Image
            source={{uri: `data:image/png;base64,${track.image}`}}
            style={{width: 50, height: 50, borderRadius: 10}}
          />
        }
        <View style={{marginLeft: 10}}>
          <Text style={themeTextStyle}>{track.title.slice(0, 35)}{track.title.length>35&&"..."}</Text>
          <Text style={{color: 'gray'}}>{track.artistAndAlbum}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}