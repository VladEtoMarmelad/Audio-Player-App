import * as FileSystem from 'expo-file-system';

export const getAllTracks = async (): Promise<void> => {
  try {
    const documentDirectory = FileSystem.documentDirectory + "tracks"
    const directoryFilesTitles = await FileSystem.readDirectoryAsync(documentDirectory) 
    const directoryFiles = await Promise.all(
      directoryFilesTitles.map(async (fileTitle: string) => {
        const file = await FileSystem.readAsStringAsync(documentDirectory + `/${fileTitle}`)
        return JSON.parse(file)
      })
    ) 
    console.log("directoryFiles:", directoryFiles)
  } catch (error) {
    console.error(error)
  }
}