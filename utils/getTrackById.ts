import { Track } from "@/types/Track"
import { File, Paths } from "expo-file-system"

export const getTrackById = (trackId: string): Track|null => {
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

    return track
  } catch (error) {
    console.error("Error while getting track from file system:", error)
    return null
  }
}
