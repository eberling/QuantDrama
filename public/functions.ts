// matrix : episode.scenes.map(scene => {
//    scene.chars.map(char =>)
//  })

//Chars can be specified , e.g. top 10 chars
import { Scene, Char, EpisodeChar } from "./interface-show";

function filterCharsFromScene(filter: Char[], scene: Scene): Scene {
  let sceneCpy = { ...scene };
  console.dir(sceneCpy, { depth: null });
  sceneCpy.chars = sceneCpy.chars.filter(char => filter.includes(char));
  return sceneCpy;
}

function filterCharsFromEpisode(filter: Char[], scenes: Scene[]): Scene[] {
  return scenes.map(scene => filterCharsFromScene(filter, scene));
}

const getCharacterSignature = (char, scenes) => {
  scenes.map();
};

function calculateSceneDensity(chars: Char[], scene: Scene): number {
  return scene.chars.length / chars.length;
}

function calculateEpisodeDensity(chars: Char[], scenes: Scene[]): number {
  // episode density is average of all scene densities
  let avgDensity = 0;
  scenes.forEach(scene => {
    avgDensity += calculateSceneDensity(chars, scene);
  });
  return avgDensity / scenes.length;
}

function calculateEpisodeConcomitance(
  chars: Char[],
  scenes: Scene[]
): {
  concomitant: EpisodeChar[];
}[] {
  const episodeChars: EpisodeChar[] = chars.map(char => {
    return {
      name: char.name,
      scenes: scenes.map(scene => {
        if (scene.chars.includes(char)) {
          return scene;
        }
      })
    };
  });
  return findIdenticalCharSignature(episodeChars);
}

function findIdenticalCharSignature(
  episodeChars: EpisodeChar[]
): {
  concomitant: EpisodeChar[];
}[] {
  if (episodeChars.length < 2) {
    return [];
  }
  const firstChar = episodeChars[0];
  const restChars = episodeChars.slice(1);
  const concomitantPairs = restChars.map(char => {
    if (JSON.stringify(firstChar.scenes) == JSON.stringify(char.scenes)) {
      return { concomitant: [firstChar, char] };
    }
  });
  return concomitantPairs.concat(findIdenticalCharSignature(restChars));
}

function calculateEpisodeDominance(scenes: Scene[]): any {
  const chars = getCharsWithSignatureFromEpisode(scenes);
  return findDominantPairs(chars);
}
// returns [{char, ['SceneA', 'SceneB']],[char, ['SceneA', 'SceneB']],[char, ['SceneA', 'SceneB']]]
function getCharsWithSignatureFromEpisode(
  chars: Char[],
  scenes: Scene[]
): EpisodeChar[] {
  return chars.map(char => {
    const epChar: EpisodeChar = {
      name: char.name,
      scenes: scenes.map(scene => {
        if (scene.chars.some(ch => ch.name === char.name)) {
          return scene;
        }
      })
    };
    return epChar;
  });
}

function findDominantPairs(chars: EpisodeChar[]): EpisodeChar[][] {
  const pairs = pair(chars);
  const dominations = pairs.map(pair => {
    const a = pair[0].scenes;
    const b = pair[1].scenes;
    if (a.length === b.length) {
      return;
    } else if (a.length > b.length) {
      if (b.every(bscene => a.some(ascene => ascene.title === bscene.title))) {
        console.log(pair[1].name + " dominated by" + pair[0].name);
        return [pair[0], pair[1]];
      }
    } else {
      if (a.every(ascene => b.some(bscene => ascene.title === bscene.title))) {
        console.log(pair[0].name + " dominated by" + pair[1].name);
        return [pair[1], pair[0]];
      }
    }
  });
  return dominations;
}

// used for density
function pair(chars: EpisodeChar[]): EpisodeChar[][] {
  if (chars.length < 2) {
    return [];
  }
  const first = chars[0];
  const rest = chars.slice(1);
  const pairs = rest.map(function(x) {
    return [first, x];
  });
  return pairs.concat(pair(rest));
}

const calculateIndependence = (chars, episode) => {};

const calculateAlternative = (chars, episode) => {};

const calculateComplementary = (chars, episode) => {};

const calculateScenicDistance = (chars, episode) => {};
