import { Scene, EpisodeChar } from "./interface-show";

function filterCharsFromScene(filter: string[], scene: Scene): Scene {
  const sceneCpy = { ...scene };
  sceneCpy.chars = sceneCpy.chars.filter((char) => filter.includes(char));
  return sceneCpy;
}

function filterCharsFromEpisode(filter: string[], scenes: Scene[]): Scene[] {
  return scenes.map((scene) => filterCharsFromScene(filter, scene));
}

function pair(chars: EpisodeChar[]): EpisodeChar[][] {
  if (chars.length < 2) {
    return [];
  }
  const first = chars[0];
  const rest = chars.slice(1);
  const pairs = rest.map((x) => {
    return [first, x];
  });
  return pairs.concat(pair(rest));
}

function arraysEqual(a: any[], b: any[]) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function calculateSceneDensity(chars: string[], scene: Scene): number {
  return scene.chars.length / chars.length;
}

function calculateEpisodeDensity(chars: string[], scenes: Scene[]): number {
  // episode density is average of all scene densities
  let avgDensity = 0;
  scenes.forEach((scene) => {
    avgDensity += calculateSceneDensity(chars, scene);
  });
  return avgDensity / scenes.length;
}

function calculateEpisodeConcomitance(
  chars: string[],
  scenes: Scene[]
): EpisodeChar[][] {
  const episodeChars = getCharacterSignatures(chars, scenes);
  return findIdenticalCharSignature(episodeChars);
}

function findIdenticalCharSignature(
  episodeChars: EpisodeChar[]
): EpisodeChar[][] | any {
  if (episodeChars.length < 2) {
    return [];
  }
  const firstChar = episodeChars[0];
  const restChars = episodeChars.slice(1);
  const concomitantPairs = restChars
    .filter((char) => {
      return JSON.stringify(firstChar.scenes) === JSON.stringify(char.scenes);
    })
    .map((char) => [firstChar, char]);
  return concomitantPairs.concat(findIdenticalCharSignature(restChars));
}

function calculateEpisodeDominance(
  chars: string[],
  scenes: Scene[]
): EpisodeChar[][] {
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
  const dominations: EpisodeChar[][] = [];
  pairs.forEach((paired) => {
    const a = paired[0].scenes;
    const b = paired[1].scenes;
    if (a.length > b.length) {
      if (
        b.every((bscene) => a.some((ascene) => ascene.title === bscene.title))
      ) {
        console.log(paired[1].name + " dominated by" + paired[0].name);
        dominations.push([paired[0], paired[1]]);
      }
    } else if (b.length > a.length) {
      if (
        a.every((ascene) => b.some((bscene) => ascene.title === bscene.title))
      ) {
        console.log(paired[0].name + " dominated by" + paired[1].name);
        dominations.push([paired[1], paired[0]]);
      }
    }
  });
  return dominations;
}

function getCharacterSignatures(
  chars: string[],
  scenes: Scene[]
): EpisodeChar[] {
  return chars.map((char) => {
    const sceneCache: Scene[] = [];
    scenes.forEach((scene) => {
      if (scene.chars.some((ch) => ch === char)) {
        sceneCache.push(scene);
      }
    });
    const epChar: EpisodeChar = {
      name: char,
      scenes: sceneCache,
    };
    return epChar;
  });
}

// weder konkomitant, noch alternativ
function calculateEpisodeIndependence(chars: string[], scenes: Scene[]) {
  console.log(chars);
  const domPairs = calculateEpisodeDominance(chars, scenes);
  console.log("dom", domPairs);
  const conPairs = calculateEpisodeAlternativity(chars, scenes);
  console.log("con", conPairs);
  const pairs = pair(getCharacterSignatures(chars, scenes));
  console.log("pairs", pairs);
  const x = pairs.filter((paired) => {
    const hasDomPair = domPairs.some((domPair) => {
      return arraysEqual(domPair, paired);
    });
    const hasConPair = conPairs.some((conPair) => {
      return arraysEqual(conPair, paired);
    });
    return !hasDomPair || !hasConPair;
  });
  return x;
}

const calculateEpisodeAlternativity = (
  chars: string[],
  scenes: Scene[]
): EpisodeChar[][] => {
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
  return pairs.filter((paired) => {
    const a = paired[0].scenes;
    const b = paired[1].scenes;
    return a.every((ae) => !b.some((be) => ae.title === be.title));
  });
};

// const calculateComplementary = (chars, episode) => {};

// const calculateScenicDistance = (chars, episode) => {};

export {
  calculateEpisodeAlternativity,
  // calculateComplementary,
  calculateEpisodeConcomitance,
  calculateEpisodeDominance,
  calculateEpisodeDensity,
  calculateEpisodeIndependence,
  calculateSceneDensity,
  filterCharsFromEpisode,
  getCharacterSignatures,
};
