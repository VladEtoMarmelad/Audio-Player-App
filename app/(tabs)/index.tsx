import { Text, View, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer';
import { getAllTracks } from '@/utils/getAllTracks';
import { deleteTrackFromFileSystem } from '@/utils/deleteTrack';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from '@/styles/GlobalStyles'

global.Buffer = Buffer;

export default function Index() {
  const [tracks, setTracks] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [selectedTrack, setSelectedTrack] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const getAndUseTracks = async (): Promise<void> => {
      let result = await getAllTracks(true)
      setTracks(result)
    }
    getAndUseTracks()
  }, [])

  const deleteTrackHandler = (): void => {
    deleteTrackFromFileSystem(selectedTrack)
    setTracks(tracks.filter((track: any) => track.title!==selectedTrack))
    setShowDeleteModal(false)
  }

  const redirectToTrackUpdateScreen = async (): Promise<void> => {
    console.log("selectedTrack:", selectedTrack)
    const track = tracks.find((track: any) => track.title===selectedTrack)
    console.log("index screen track title:", track.title)

    setSelectedTrack("")

    router.push({
      pathname: "/saveTrack", 
      params: {defaultTrackInfo: JSON.stringify({
        tags: {
          title: track.title,
          artist: track.artist,
          album: track.album
        },
        image: {
          imageUri: track.imageUri,
          imageBase64: track.image //TODO: not give imageBase64 but only imageUri and getting image from FS in saveTrack screen
        },
        audioUri: track.audioUri
      })}
    })
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 15}}>
      <Link
        href="/saveTrack"
        style={{backgroundColor: 'darkgray', borderRadius: 15, width: 125, height: 70, marginTop: 50, padding: 10}}
      >
        <View>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>+</Text>
          <Text style={{fontSize: 12, fontWeight: 'bold'}}>Добавить трэк</Text>
        </View>
      </Link>
      
      <FlatList 
        data={tracks}
        renderItem={({item: track, index}) => 
          <View key={index} style={{flexDirection: 'row', marginTop: 15, alignItems: 'center', width: '100%'}}>
            {track.image!=="" && 
              <Image
                source={{uri: `data:image/png;base64,${track.image}`}}
                style={{width: 50, height: 50, borderRadius: 10}}
              />
            }
            <View style={{marginLeft: 10}}>
              <Text>{track.title}</Text>
              <Text style={{color: 'gray'}}>{track.artistAndAlbum}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => {
                setShowModal(true);
                setSelectedTrack(track.title)
              }}
              style={{marginLeft: 'auto'}}
            >
              <Entypo 
                name="dots-three-vertical" 
                size={18} 
                color="gray"
              />
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={[globalStyles.modalView, globalStyles.lightThemeModalView]}>
          <TouchableOpacity
            onPress={redirectToTrackUpdateScreen}
            style={{width: '100%'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Редактировать</Text></TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowDeleteModal(true);
              setShowModal(false)
            }}
            style={{width: '100%'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить</Text></TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowModal(!showDeleteModal)}
      >
        <View style={[globalStyles.modalView, globalStyles.lightThemeModalView]}>
          <View style={{width: '100%'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Удалить</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить песню "{selectedTrack}"</Text>
          </View>
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(false)}
              style={[globalStyles.button, {backgroundColor: 'darkgray'}]}
            ><Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Отмена</Text></TouchableOpacity>

            <TouchableOpacity
              onPress={deleteTrackHandler}
              style={[globalStyles.button, {backgroundColor: 'red'}]}
            ><Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Удалить</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
