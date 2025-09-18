export interface Track {
  id?: string; 
  title: string;
  album: string;
  artist: string;
  artistAndAlbum?: string;

  audioUri: string;
  imageUri: string;
  audio?: string;  
  image?: string;
}
