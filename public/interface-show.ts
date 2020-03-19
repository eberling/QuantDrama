interface Episode {
  title: String;
  episodeNum: Number;
  season: Number;
  chars: Char[];
  scenes: Scene[];
}

interface Scene {
  title: String;
  chars: Char[];
  sceneNum: number;
}

interface Char {
  name: String;
}

interface EpisodeChar {
  name: String;
  scenes: Scene[];
}

interface Season {
  episodes: Episode[];
}

export { Season, Episode, Scene, Char, EpisodeChar };
