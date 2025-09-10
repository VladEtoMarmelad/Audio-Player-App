import * as FileSystem from 'expo-file-system';

interface TrackObject {
  title: string;
  album: string;
  artist: string;

  audioUri: string;
  imageUri: string;
}

export const saveTrackToFileSystem = async (trackObject: TrackObject): Promise<void> => {
  const documentDirectory = FileSystem.documentDirectory + "tracks"
  const trackDirectory = documentDirectory + `/${trackObject.title}`
  try {
    const dirInfo = await FileSystem.getInfoAsync(documentDirectory);
    console.log("dirInfo:", dirInfo)
    if (!dirInfo.exists) { // sure directory exist 
      await FileSystem.makeDirectoryAsync(documentDirectory) // create directory if not exist
    }

    console.log("JSON.stringify(trackObject):", JSON.stringify(trackObject)) 

    FileSystem.writeAsStringAsync(trackDirectory, JSON.stringify(trackObject)) // save trackObject to directory
  } catch (error) {
    console.error("Error while saving file to file system:", error)
  }
}