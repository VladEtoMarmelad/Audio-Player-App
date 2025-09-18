import { documentDirectory, deleteAsync } from 'expo-file-system/legacy';

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