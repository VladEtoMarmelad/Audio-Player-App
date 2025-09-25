import { Directory, Paths, File } from "expo-file-system"
import { Playlist } from "@/types/Playlist"

export const getAllPlaylists = (): Playlist[] => {
  const playlistsDir = new Directory(Paths.document, "playlists")
  const playlistsDirContent = playlistsDir.list()

  let playlists: Playlist[] = [];
  playlistsDirContent.forEach((playlist) => {
    const playlistFile = new File(playlist.uri)
    let playlistObject = JSON.parse(playlistFile.textSync())

    // const image = new File(playlistObject.imageUri)
    // playlistObject.image = image.base64Sync()

    playlists.push(playlistObject)
  })

  return playlists
}