import { Track } from "@/types/Track"
import { File, Paths } from "expo-file-system"

export const getTrackById = (trackId: string, returnConnectedArtistAndAlbum: boolean = false): Track|null => {
  try {
    console.log("trackId:", trackId)
    const trackFile = new File(Paths.document, "tracks", `${trackId}.txt`)
    const track = JSON.parse(trackFile.textSync())

    if (track.imageUri!=="") {
      const image = new File(track.imageUri)
      track.image = image.base64Sync()
    }

    if (track.audioUri!=="") {
      const audio = new File(track.audioUri)
      track.audio = audio.base64Sync()
    }

    if (returnConnectedArtistAndAlbum) {
      let artistAndAlbum: string = `${track.artist} | ${track.album}`
      if (artistAndAlbum.length>=35) {
        artistAndAlbum = `${artistAndAlbum.slice(0, 35)}...`
      }
      track.artistAndAlbum = artistAndAlbum
    }

    return track
  } catch (error) {
    console.error("Error while getting track from file system:", error)
    return null
  }
}
