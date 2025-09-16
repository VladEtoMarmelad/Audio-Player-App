import { documentDirectory, deleteAsync } from 'expo-file-system/legacy';

export const deleteTrackFromFileSystem = async (trackTitle: string): Promise<void> => {
  if (trackTitle!=="") { //verifying to not delete whole directory
    const tracksDirectory = documentDirectory + "tracks"
    const trackDirectory = tracksDirectory + `/${trackTitle}`

    try {
      await deleteAsync(trackDirectory)
    } catch (error) {
      console.error("Error while deleting file from file system:", error)
    }
  }
}