import { Paths, File } from "expo-file-system"
import { Playlist } from "@/types/Playlist";

export const getPlaylistById = (id: string): Playlist|null => {
  try {
    const playlistFile = new File(Paths.document, "playlists", `${id}.txt`)
    let playlist = JSON.parse(playlistFile.textSync())

    if (playlist.imageUri!=="") {
      const image = new File(playlist.imageUri)
      playlist.image = image.base64Sync()
    }

    return playlist
  } catch (error: unknown) {
    console.error("Error while getting playlist from file system:", error)
    return null
  }
}