import { Directory, Paths, File } from "expo-file-system"

export const getIDsFromDocumentDir = (subdirName: string): string[] => {
  try {
    const directory = new Directory(Paths.document, subdirName)
    const files = directory.list()

    let IDs: string[] = []
    files.forEach((fileInfo) => {
      const file = new File(fileInfo.uri)
      const fileObject = JSON.parse(file.textSync())
      IDs.push(fileObject.id)
    })

    return IDs
  } catch (error: unknown) {
    console.error(`Error while getting IDs from ${subdirName} directory:`, error)
    return []
  }
}