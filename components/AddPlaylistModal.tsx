import { getThemeStyle } from "@/utils/getThemeStyle"
import { View, Modal, TextInput, TouchableOpacity, Text } from "react-native"
import { useAppSelector } from "@/store"
import { saveFileToDocumentDir } from "@/utils/saveFileToDocumentDir";
import { useState } from "react";
import { useRouter } from "expo-router";
import globalStyles from "@/styles/GlobalStyles"

interface AddPlaylistModalProps {
  showAddModal: boolean;
  setShowAddModal: (value: boolean) => void
}

export const AddPlaylistModal = ({showAddModal, setShowAddModal}: AddPlaylistModalProps) => {
  const router = useRouter()
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const [title, setTitle] = useState<string>("")

  const addPlaylistHandler = () => {
    setShowAddModal(!showAddModal)
    saveFileToDocumentDir("playlists", {
      title: title,
      imageUri: "",

      tracksUri: []
    })
    router.replace("/playlists")    
  }

  const themeModalViewStyle = getThemeStyle(colorScheme, globalStyles, "ModalView")
  const themeInputStyle = getThemeStyle(colorScheme, globalStyles, "Input")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showAddModal}
      onRequestClose={() => setShowAddModal(!showAddModal)}
    >
      <View style={[globalStyles.modalView, themeModalViewStyle, {alignSelf: 'center', width: '75%', marginTop: 'auto', marginBottom: 15, padding: 15}]}>
        <TextInput
          value={title}
          onChangeText={(e) => setTitle(e)}
          placeholder="Название плэйлиста..."
          placeholderTextColor={colorScheme==="dark" ? 'white' : 'black'}
          style={[globalStyles.input, themeInputStyle]}
        />
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
          <TouchableOpacity
            onPress={() => setShowAddModal(!showAddModal)}
            style={[globalStyles.button, {backgroundColor: 'darkgray', width: '49%'}]}
          >
            <Text style={themeTextStyle}>Отмена</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addPlaylistHandler}
            style={[globalStyles.button, {backgroundColor: 'darkgray', width: '49%'}]}
          >
            <Text>ОК</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}