import * as FileSystem from 'expo-file-system';

export const getAllTracks = async (getImage: boolean = false): Promise<any> => {
  try {
    const documentDirectory = FileSystem.documentDirectory + "tracks"
    const directoryFilesTitles = await FileSystem.readDirectoryAsync(documentDirectory) 
    const directoryFiles = await Promise.all(
      directoryFilesTitles.map(async (fileTitle: string) => {
        let file: any = await FileSystem.readAsStringAsync(documentDirectory + `/${fileTitle}`)
        file = JSON.parse(file)
        console.log("file:", file)

        let artistAndAlbum: string = `${file.artist} | ${file.album}`
        if (artistAndAlbum.length>=40) {
          artistAndAlbum = `${artistAndAlbum.slice(0, 40)}...`
        }
        file.artistAndAlbum = artistAndAlbum

        if (getImage && file.imageUri!=="") {
          const image = await FileSystem.readAsStringAsync(file.imageUri, {encoding: FileSystem.EncodingType.Base64})
          file.image = image
        }

        return file
      })
    ) 

    return directoryFiles
  } catch (error) {
    console.error(error)
  }
}