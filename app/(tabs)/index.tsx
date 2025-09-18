import { Text, View, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer';
import { getAllTracks } from '@/utils/getAllTracks';
import { deleteTrackFromFileSystem } from '@/utils/deleteTrack';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Track } from '@/types/Track';
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from '@/styles/GlobalStyles'

global.Buffer = Buffer;

export default function Index() {
  const [tracks, setTracks] = useState<Track[]|null>(null);
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [selectedTrack, setSelectedTrack] = useState<any>(null)
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      const getAndUseTracks = async (): Promise<void> => {
        let result = await getAllTracks(true)
        setTracks(result)
      }
      getAndUseTracks()
    }, [])
  )

  const deleteTrackHandler = (): void => {
    deleteTrackFromFileSystem(selectedTrack.id)
    //setTracks(tracks.filter((track: any) => track.title!==selectedTrack.title))
    setTracks((prevTracks: any) => prevTracks.filter((track: any) => track.title!==selectedTrack.title))
    setShowDeleteModal(false)
  }

  const redirectToTrackUpdateScreen = async (): Promise<void> => {
    const track = tracks?.find((track: any) => track.title===selectedTrack.title)

    setShowModal(false)
    setSelectedTrack(null)

    router.push({
      pathname: "/saveTrack", 
      params: {defaultTrackInfo: JSON.stringify({
        tags: {
          id: track?.id,
          title: track?.title,
          artist: track?.artist,
          album: track?.album
        },
        imageUri: track?.imageUri, 
        audioUri: track?.audioUri
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
        keyExtractor={track => track.id ? track.id : track.title}
        renderItem={({item: track}) => 
          <Link 
            href={{
              pathname: "/[trackId]",
              params: {trackId: track.id ?? track.title}
            }}
            style={{marginTop: 15}}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
              {track.image!=="" && 
                <Image
                  source={{uri: `data:image/png;base64,${track.image}`}}
                  style={{width: 50, height: 50, borderRadius: 10}}
                />
              }
              <View style={{marginLeft: 10}}>
                <Text>{track.title.slice(0, 40)}{track.title.length>40&&"..."}</Text>
                <Text style={{color: 'gray'}}>{track.artistAndAlbum}</Text>
              </View>

              <TouchableOpacity 
                onPress={() => {
                  setShowModal(true);
                  setSelectedTrack({
                    id: track.id,
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
            </View>
          </Link>
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
            style={{width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
          ><Text style={{fontSize: 16, fontWeight: 'bold'}}>Редактировать</Text></TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowDeleteModal(true);
              setShowModal(false)
            }}
            style={{width: '100%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10, backgroundColor: 'darkgray'}}
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
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Удалить песню "{selectedTrack?.title}"</Text>
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
