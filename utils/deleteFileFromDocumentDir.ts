import { Paths, File } from "expo-file-system"

export const deleteFileFromDocumentDir = async (subdirName: string, fileId: string): Promise<void> => {
  try {
    const file = new File(Paths.document, subdirName, `${fileId}.txt`)
    file.delete()
  } catch (error: unknown) {
    console.error("Error while deleting file from file system:", error)
  }
}