import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';
import { AudioFileMetadata } from '@/types/AudioFileMetadata';

export const getMetadata = async (audioFileBase64: string): Promise<AudioFileMetadata> => {
  const fileBuffer = Buffer.from(audioFileBase64, "base64");

  return new Promise((resolve) => {
    new jsmediatags.Reader(fileBuffer).read({
      onSuccess: (tag: any) => {
        console.log("Теги успешно прочитаны:", JSON.stringify(tag, null, 2));
        resolve({
          tags: tag.tags,
          error: ""
        })
      },
      onError: (error: any) => {
        console.log("Ошибка чтения тегов:", error);
        resolve({
          tags: null,
          error: `Ошибка: ${error.type} - ${error.info}`
        })
      }
    });
  })
}