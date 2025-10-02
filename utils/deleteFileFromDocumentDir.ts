import { Paths, File } from "expo-file-system"
import { getAllPlaylists } from "./getAllPlaylists"
import { Playlist } from "@/types/Playlist"

export const deleteFileFromDocumentDir = (subdirName: string, fileId: string): void => {
  try {
    const file = new File(Paths.document, subdirName, `${fileId}.txt`)
    file.delete()

    if (subdirName==="tracks") { //if deleted item is track - delete track from playlists
      const allPlaylists = getAllPlaylists()
      const playlistsWithDeletedTrack = allPlaylists?.filter((playlist: Playlist) => playlist.tracksIDs.includes(fileId))
      playlistsWithDeletedTrack?.forEach((playlist: Playlist) => {
        const playlistFile = new File(Paths.document, "playlists", `${playlist.id}.txt`)
        playlistFile.write(JSON.stringify({
          ...playlist,
          tracksIDs: playlist.tracksIDs.filter((trackId: string) => trackId!==fileId)
        }))
      })
    }

  } catch (error: unknown) {
    console.error("Error while deleting file from file system:", error)
  }
}