import { Platform } from 'react-native';
import { ImageInfo } from '@/types/ImageInfo';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

export const pickImage = async (): Promise<ImageInfo|null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({type: "image/*"});

    if (result.canceled) {
      console.log("Выбор файла отменен");
      return null
    }

    const image = result.assets?.[0];
    console.log("imageFile:", image)
    let imageBase64: string = "";
    
    if (Platform.OS==="web") {
      imageBase64 = image.uri
    } else {
      console.log("File URI:", image.uri);
    
      imageBase64 = await readAsStringAsync(image.uri, {
        encoding: EncodingType.Base64,
      });
    }

    return {
      imageBase64,
      imageUri: image.uri
    }
  } catch (error) {
    console.log("Неизвестная ошибка:", error);
    return null
  }
}