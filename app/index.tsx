import { TouchableOpacity, Text, View, Image } from 'react-native';
import { useState } from 'react';
import { Buffer } from 'buffer';
import { getMetadata } from '@/utils/getMetadata';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

global.Buffer = Buffer;

export default function Index() {

  const [tags, setTags] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const pickAndReadAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true
      });

      console.log("DocumentPicker result:", result);

      if (result.canceled) {
        console.log("Выбор файла отменен");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        console.log("File URI:", fileUri);

        const fileContentBase64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const metadata = await getMetadata(fileContentBase64)
        console.log("metadata:", JSON.stringify(metadata, null, 2))
        setTags(metadata.tags)
        setError(metadata.error)
      }
    } catch (error) {
      console.log("Неизвестная ошибка:", error);
      setError("Произошла непредвиденная ошибка.");
      setTags(null);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={pickAndReadAudioFile}
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
    </View>
  );
}
