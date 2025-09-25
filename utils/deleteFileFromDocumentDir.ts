import { Paths, File } from "expo-file-system"

export const deleteFileFromDocumentDir = (subdirName: string, fileId: string): void => {
  try {
    const file = new File(Paths.document, subdirName, `${fileId}.txt`)
    file.delete()
  } catch (error) {
    console.error("Error while deleting file from file system:", error)
  }
}