import { View, Image, TouchableOpacity, Text } from "react-native";
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { Track } from "@/types/Track";
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from '@/styles/GlobalStyles'

interface TrackItemProps {
  track: Track;

  setShowModal?: (value: boolean) => void;
  setSelectedTrack?: (value: {id: string|undefined, title: string}) => void
}

export const TrackItem = ({track, setShowModal, setSelectedTrack}: TrackItemProps) => {
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
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

      {(setShowModal || setSelectedTrack) &&
        <TouchableOpacity 
          onPress={() => {
            setShowModal && setShowModal(true);
            setSelectedTrack && setSelectedTrack({
              id: track?.id,
              title: track.title
            })
          }}
          style={{marginLeft: 'auto'}}
        >
          <Entypo 
            name="dots-three-vertical" 
            size={18} 
            color="gray"
          />
        </TouchableOpacity>
      }
    </View>
  )
}