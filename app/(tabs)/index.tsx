import { Text, View, FlatList } from 'react-native';
import { Buffer } from 'buffer';
import { getAllTracks } from '@/utils/getAllTracks';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';

global.Buffer = Buffer;

export default function Index() {
  const [tracks, setTracks] = useState<any>(null);

  useEffect(() => {
    const getAndUseTracks = async (): Promise<void> => {
      const result = await getAllTracks()
      setTracks(result)
    }
    getAndUseTracks()
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList 
        data={tracks}
        renderItem={({item: track, index}) => 
          <View key={index} style={{marginTop: 15}}>
            <Text>{track.title}</Text>
            <Text>{track.artist}</Text>
            <Text>{track.album}</Text>
          </View>
        }
      />

      <Link
        href="/addTrack"
        style={{position: 'absolute', top: 15, right: 15, backgroundColor: 'darkgray', borderRadius: 15, width: 50, height: 50, textAlign: 'center'}}
      >
        <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 50}}>+</Text>
      </Link>
    </View>
  );
}
