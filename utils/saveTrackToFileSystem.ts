import { documentDirectory, getInfoAsync, makeDirectoryAsync, writeAsStringAsync } from 'expo-file-system/legacy'
import { Track } from '@/types/Track';
import uuid from 'react-native-uuid';

// this function can be used for both posting file to file system and updting file
export const saveTrackToFileSystem = async (trackObject: Track): Promise<void> => {
  const tracksDirectory = documentDirectory + "tracks"

  if (!trackObject.id) { // if function used for adding track
    trackObject.id=uuid.v4();
  }

  const trackDirectory = tracksDirectory + `/${trackObject.id}`
  try {
    const dirInfo = await getInfoAsync(tracksDirectory);
    console.log("dirInfo:", dirInfo)
    if (!dirInfo.exists) { // sure directory exist 
      await makeDirectoryAsync(tracksDirectory) // create directory if not exist
    }

    console.log("JSON.stringify(trackObject):", JSON.stringify(trackObject)) 

    writeAsStringAsync(trackDirectory, JSON.stringify(trackObject)) // save trackObject to directory
  } catch (error) {
    console.error("Error while saving file to file system:", error)
  }
}