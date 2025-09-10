import { getMetadata } from './getMetadata';
import { Platform } from 'react-native';
import { AudioFileMetadata } from '@/types/AudioFileMetadata';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export const pickAndReadAudioFile = async (): Promise<AudioFileMetadata> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true
    });

    console.log("DocumentPicker result:", result);

    if (result.canceled) {
      console.log("Выбор файла отменен");
      return {
        fileUri: "",
        tags: null,
        error: ""
      }
    }

    const file = result.assets?.[0];
    let fileContentBase64: string = "";

    if (Platform.OS==="web") {
      fileContentBase64 = file.uri
    } else {
      const fileUri = file.uri;
      console.log("File URI:", fileUri);

      fileContentBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
   
    const metadata = await getMetadata(fileContentBase64)
    console.log("metadata:", JSON.stringify(metadata, null, 2))
    return {
      fileUri: file.uri,
      tags: metadata.tags,
      error: metadata.error
    }
  } catch (error) {
    console.log("Неизвестная ошибка:", error);
    return {
      fileUri: "",
      tags: null,
      error: "Произошла непредвиденная ошибка."
    }
  }
};