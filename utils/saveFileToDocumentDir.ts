import { Paths, File } from "expo-file-system"
import { Track } from "@/types/Track";
import { Playlist } from "@/types/Playlist";
import uuid from 'react-native-uuid';

// this function can be used for both posting file to file system and updting file
export const saveFileToDocumentDir = (subdirName: string, fileContent: Track|Playlist): void => {
  if (!fileContent.id) { // if function used for adding file
    fileContent.id=uuid.v4();
  }
  
  console.log("JSON.stringify(trackObject):", JSON.stringify(fileContent)) 
  try {
    const newFile = new File(Paths.document, subdirName, `${fileContent.id}.txt`)
    newFile.create({overwrite: true})
    newFile.write(JSON.stringify(fileContent))
  } catch (error) {
    console.error("Error while saving file to file system:", error)
  }
}