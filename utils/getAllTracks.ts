import { documentDirectory, readDirectoryAsync, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

export const getAllTracks = async (getImage: boolean = false): Promise<any> => {
  try {
    const tracksDirectory = documentDirectory + "tracks"
    const tracksTitles = await readDirectoryAsync(tracksDirectory) 
    const tracks = await Promise.all(
      tracksTitles.map(async (fileTitle: string) => {
        let file: any = await readAsStringAsync(tracksDirectory + `/${fileTitle}`)
        file = JSON.parse(file)
        console.log("file:", file)

        let artistAndAlbum: string = `${file.artist} | ${file.album}`
        if (artistAndAlbum.length>=40) {
          artistAndAlbum = `${artistAndAlbum.slice(0, 40)}...`
        }
        file.artistAndAlbum = artistAndAlbum

        if (getImage && file.imageUri!=="") {
          const image = await readAsStringAsync(file.imageUri, {encoding: EncodingType.Base64})
          file.image = image
        }

        return file
      })
    ) 

    return tracks
  } catch (error) {
    console.error("Error while getting tracks from file system:", error)
  }
}