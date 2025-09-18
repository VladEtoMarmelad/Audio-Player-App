import { documentDirectory, readDirectoryAsync, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

export const getAllTracks = async (getImage: boolean = false): Promise<any> => {
  try {
    const tracksDirectory = documentDirectory + "tracks"
    const tracksIDs = await readDirectoryAsync(tracksDirectory) 
    const tracks = await Promise.all(
      tracksIDs.map(async (trackID: string) => {
        let track: any = await readAsStringAsync(tracksDirectory + `/${trackID}`)
        track = JSON.parse(track)
        console.log("track:", track)

        let artistAndAlbum: string = `${track.artist} | ${track.album}`
        if (artistAndAlbum.length>=40) {
          artistAndAlbum = `${artistAndAlbum.slice(0, 40)}...`
        }
        track.artistAndAlbum = artistAndAlbum

        if (getImage && track.imageUri!=="") {
          const image = await readAsStringAsync(track.imageUri, {encoding: EncodingType.Base64})
          track.image = image
        }

        return track
      })
    ) 

    return tracks
  } catch (error) {
    console.error("Error while getting tracks from file system:", error)
  }
}