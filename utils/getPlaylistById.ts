import { Paths, File } from "expo-file-system"
import { Playlist } from "@/types/Playlist";
import { getTrackById } from "./getTrackById";
import { Track } from "@/types/Track";

export const getPlaylistById = (id: string): Playlist|null => {
  try {
    const playlistFile = new File(Paths.document, "playlists", `${id}.txt`)
    let playlist: Playlist = JSON.parse(playlistFile.textSync())

    if (playlist.imageUri!=="") {
      const image = new File(playlist.imageUri)
      playlist.image = image.base64Sync()
    }
    
    let tracks: Track[] = []
    playlist.tracksIDs.forEach((trackId) => {
      const track = getTrackById(trackId, true)
      if (track) tracks.push(track)
    })
    playlist.tracks = tracks

    return playlist
  } catch (error: unknown) {
    console.error("Error while getting playlist from file system:", error)
    return null
  }
}