import { documentDirectory, deleteAsync } from 'expo-file-system/legacy';

//this function will be deleted when fully replaced with deleteFileFromDocumentDir function 
export const deleteTrackFromFileSystem = async (trackId: string): Promise<void> => {
  if (trackId!=="") { //verifying to not delete whole directory
    const tracksDirectory = documentDirectory + "tracks"
    const trackDirectory = tracksDirectory + `/${trackId}`

    try {
      await deleteAsync(trackDirectory)
    } catch (error) {
      console.error("Error while deleting file from file system:", error)
    }
  }
}