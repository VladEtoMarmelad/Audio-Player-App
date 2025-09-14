import { documentDirectory, getInfoAsync, makeDirectoryAsync, writeAsStringAsync } from 'expo-file-system'

interface TrackObject {
  title: string;
  album: string;
  artist: string;

  audioUri: string;
  imageUri: string;
}

// this function can be used for both posting file to file system and updting file
export const saveTrackToFileSystem = async (trackObject: TrackObject): Promise<void> => {
  const tracksDirectory = documentDirectory + "tracks"
  const trackDirectory = tracksDirectory + `/${trackObject.title}`
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