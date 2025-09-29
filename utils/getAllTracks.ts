import { Directory, Paths, File } from "expo-file-system"
import { Track } from "@/types/Track"

export const getAllTracks = (getImage: boolean = false): Track[]|null => {
  try {
    const tracksDir = new Directory(Paths.document, "tracks")
    const tracksDirContent = tracksDir.list()
    
    let tracks: Track[] = [];
    tracksDirContent.forEach((track) => {
      const trackFile = new File(track.uri)
      let trackObject = JSON.parse(trackFile.textSync())
      console.log("trackObject:", trackObject)

      let artistAndAlbum: string = `${trackObject.artist} | ${trackObject.album}`
      if (artistAndAlbum.length>=40) {
        artistAndAlbum = `${artistAndAlbum.slice(0, 40)}...`
      }
      trackObject.artistAndAlbum = artistAndAlbum

      if (trackObject.imageUri!=="") {
        const image = new File(trackObject.imageUri)
        trackObject.image = image.base64Sync()
      }
    
      tracks.push(trackObject)
    })
    
    return tracks
  } catch (error: unknown) {
    console.error("Error while getting tracks from file system:", error)
    return null
  }
}