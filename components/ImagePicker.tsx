import { TouchableOpacity, Image, View } from "react-native"
import { pickImage } from "@/utils/pickImage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useRef } from "react";
import { File } from "expo-file-system";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ImagePickerProps {
  setImage: (value: string|null) => void;
}

export const ImagePicker = ({setImage}: ImagePickerProps) => {
  const [preshowImage, setPreshowImage] = useState<string|null>(null)
  const imageUri = useRef<string|null>(null)
  useFocusEffect(
    useCallback(() => {
      console.log("imageUri:", imageUri)
      if (imageUri.current) {
        const imageFile = new File(imageUri.current ?? "")
        setImage(imageFile.base64Sync())
      }
    }, [imageUri])
  )

  const pickImageHandler = async () => {
    const result = await pickImage()
    imageUri.current = result?.imageUri ?? ""
    setPreshowImage(result?.imageBase64 ?? "")
    setImage(result?.imageUri ?? null)
  }

  return (
    <TouchableOpacity
      onPress={pickImageHandler}
      style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%'}}
    >
      {preshowImage ? 
        <Image
          source={{uri: `data:image/png;base64,${preshowImage}`}}
          style={{width: 300, height: 300, borderRadius: 15}}
        />
          :
        <View style={{backgroundColor: 'black', borderRadius: 15, width: '100%'}}>
          <MaterialIcons 
            name="audiotrack" 
            size={300}
            color="white" 
          />
        </View>
      }
    </TouchableOpacity>
  )
}