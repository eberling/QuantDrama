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

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

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
): EpisodeChar[][] {
  const episodeChars = getCharacterSignatures(chars, scenes);
  return findIdenticalCharSignature(episodeChars);
}

function findIdenticalCharSignature(
  episodeChars: EpisodeChar[]
): EpisodeChar[][] {
  if (episodeChars.length < 2) {
    return [];
  }
  const firstChar = episodeChars[0];
  const restChars = episodeChars.slice(1);
  const concomitantPairs = restChars.map(char => {
    if (JSON.stringify(firstChar.scenes) == JSON.stringify(char.scenes)) {
      return [firstChar, char];
    }
  });
  return concomitantPairs.concat(findIdenticalCharSignature(restChars));
}

function calculateEpisodeDominance(
  chars: Char[],
  scenes: Scene[]
): EpisodeChar[][] {
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
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

function getCharacterSignatures(chars: Char[], scenes: Scene[]): EpisodeChar[] {
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

// weder konkomitant, noch alternativ
function calculateIndependence(chars: Char[], scenes: Scene[]) {
  const domPairs = calculateEpisodeDominance(chars, scenes);
  const conPairs = calculateEpisodeAlternativity(chars, scenes);
  const pairs = pair(getCharacterSignatures(chars, scenes));
  const x = pairs.map(pair => {
    if (
      domPairs.some(domPair => {
        arraysEqual(domPair, pair);
      })
    ) {
      return;
    } else if (
      conPairs.some(conPair => {
        arraysEqual(conPair, pair);
      })
    ) {
      return;
    } else {
      return pair;
    }
  });
  return x;
}

const calculateEpisodeAlternativity = (
  chars: Char[],
  scenes: Scene[]
): EpisodeChar[][] => {
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
  const alternatePairs = pairs.map(pair => {
    const a = pair[0].scenes;
    const b = pair[1].scenes;
    //true if no intersect
    if (a.every(ae => !b.some(be => ae.title === be.title))) {
      return pair;
    }
  });
  return alternatePairs;
};

// const calculateComplementary = (chars, episode) => {};

const calculateScenicDistance = (chars, episode) => {};

export {
  calculateEpisodeAlternativity,
  // calculateComplementary,
  calculateEpisodeConcomitance,
  calculateEpisodeDensity,
  calculateIndependence,
  calculateSceneDensity,
  filterCharsFromEpisode
};
