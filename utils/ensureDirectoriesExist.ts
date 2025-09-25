import { Directory, Paths, File } from "expo-file-system"

export const ensureDirectoriesExist = (): void => {
  try {
    const directories: string[] = ["tracks", "playlists"];

    directories.forEach(dirName => {
      const dir = new Directory(Paths.document, dirName);
      const dirInfo = dir.info();
      
      if (!dirInfo.exists) {
        dir.create();
      }
    });

    //sessionInfo dir
    const sessionInfoFile = new File(Paths.cache, "sessionInfo.txt")
    const sessionInfoFileInfo = sessionInfoFile.info()

    if (!sessionInfoFileInfo.exists) {
      sessionInfoFile.create()
      sessionInfoFile.write(JSON.stringify({
        colorScheme: "system"
      }))
    }

  } catch (error: unknown) {
    console.error("Error while ensuring all requireq directories exist:", error)
  }
}