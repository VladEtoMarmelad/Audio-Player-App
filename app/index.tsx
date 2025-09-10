import { TouchableOpacity, Text, View, Image } from 'react-native';
import { useState, useRef } from 'react';
import { Buffer } from 'buffer';
import { pickAndReadAudioFile } from '@/utils/pickAndReadAudioFile';
import { saveTrackToFileSystem } from '@/utils/saveTrackToFileSystem';
import { getAllTracks } from '@/utils/getAllTracks';

global.Buffer = Buffer;

export default function Index() {
  const [tags, setTags] = useState<any>(null);
  const [error, setError] = useState<string>("");
  let audioUri = useRef<string>("");
  let imageUri = useRef<string>("");

  const pickAndReadAudioFileHandler = async () => {
    const result = await pickAndReadAudioFile()
    console.log("final result:", result)
    setTags(result.tags)
    setError(result.error)
    audioUri.current = result.fileUri
  };

  const saveTrackToFileSystemHandler = () => {
    const trackObject = {
      title: tags.title,
      album: tags.album,
      artist: tags.artist,

      audioUri: audioUri.current,
      imageUri: imageUri.current
    }
    saveTrackToFileSystem(trackObject)
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={pickAndReadAudioFileHandler}
      ><Text>Выбрать и прочитать аудио файл</Text></TouchableOpacity>
      {error ? <Text>{error}</Text> : null}
      {tags && (
        <View>
          <Text>Название: {tags.title}</Text>
          <Text>Исполнитель: {tags.artist}</Text>
          <Text>Альбом: {tags.album}</Text>
          <Text>Год: {tags.year}</Text>
          {tags.picture && (
            <Image
              source={{ uri: `data:${tags.picture.format};base64,${Buffer.from(tags.picture.data).toString('base64')}` }}
            />
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={saveTrackToFileSystemHandler}
        style={{marginTop: 15}}
      ><Text>test adding track to FileSystem</Text></TouchableOpacity>

      <TouchableOpacity
        onPress={getAllTracks}
        style={{marginTop: 15}}
      ><Text>read all from "tracks" directory</Text></TouchableOpacity>
    </View>
  );
}
