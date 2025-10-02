import { Track } from "./Track";

export interface Playlist {
  id?: string;
  title: string;
  
  tracksIDs: string[];
  imageUri: string; 
  image?: string;
  tracks?: Track[]
} 