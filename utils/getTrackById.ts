import { documentDirectory, readAsStringAsync, EncodingType } from "expo-file-system/legacy";

export const getTrackById = async (trackId: string): Promise<any> => {
  const tracksDirectory = documentDirectory + "tracks"
  const trackDirectory = tracksDirectory + `/${trackId}`

  try {
    let track: any = await readAsStringAsync(trackDirectory)
    track = JSON.parse(track)

    track.image = await readAsStringAsync(track.imageUri, {encoding: EncodingType.Base64})
    track.audio = await readAsStringAsync(track.audioUri, {encoding: EncodingType.Base64})

    return track
  } catch (error) {
    console.error("Error while getting track from file system:", error)
  }
}