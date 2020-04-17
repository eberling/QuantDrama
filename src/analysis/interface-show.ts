interface Episode {
  title: string;
  episodeNum: number;
  season: number;
  chars: String[];
  scenes: Scene[];
}

interface Scene {
  title: string;
  chars: string[];
  sceneNum: number;
}

interface Char {
  name: string;
}

interface EpisodeChar {
  name: string;
  scenes: Scene[];
}

interface Season {
  episodes: Episode[];
}

interface DynamicPair {
  chars: EpisodeChar[];
  dynamicType: String;
}

export { Season, Episode, Scene, Char, EpisodeChar, DynamicPair };
