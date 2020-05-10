import { Scene, EpisodeChar, DynamicPair } from "./interface-show";

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
): DynamicPair[] {
  const episodeChars: EpisodeChar[] = getCharacterSignatures(chars, scenes);
  const concomitantPairs: EpisodeChar[][] = findIdenticalCharSignatures(
    episodeChars
  );
  const concomitantDynamicPairs: DynamicPair[] = concomitantPairs.map(
    (concomitantPair) => {
      return { chars: concomitantPair, dynamicType: "concomitant" };
    }
  );
  return concomitantDynamicPairs;
}

function findIdenticalCharSignatures(
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
  return concomitantPairs.concat(findIdenticalCharSignatures(restChars));
}

function calculateEpisodeDominance(
  chars: string[],
  scenes: Scene[]
): DynamicPair[] {
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
  const dominations: DynamicPair[] = [];
  pairs.forEach((paired) => {
    const a = paired[0].scenes;
    const b = paired[1].scenes;
    if (a.length > b.length) {
      if (
        b.every((bscene) => a.some((ascene) => ascene.title === bscene.title))
      ) {
        dominations.push({
          chars: [paired[0], paired[1]],
          dynamicType: "dominated by",
        });
      }
    } else if (b.length > a.length) {
      if (
        a.every((ascene) => b.some((bscene) => ascene.title === bscene.title))
      ) {
        dominations.push({
          chars: [paired[1], paired[0]],
          dynamicType: "dominated by",
        });
      }
    }
  });
  console.log("epChars", epChars);
  console.log("dominations", dominations);
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
  const domPairs = calculateEpisodeDominance(chars, scenes);
  const conPairs = calculateEpisodeConcomitance(chars, scenes);
  const pairs = pair(getCharacterSignatures(chars, scenes));
  const independentPairs = pairs.filter((paired) => {
    const isDomPair = domPairs.some((domPair) => {
      const domPairArr = domPair.chars.map((char) => char.name);
      return paired.every((char) => domPairArr.includes(char.name));
    });
    if (isDomPair) {
      return false;
    }
    const isConPair = conPairs.some((conPair) => {
      const isConPairArr = conPair.chars.map((char) => char.name);
      return paired.some((char) => isConPairArr.includes(char.name));
    });
    if (isConPair) {
      return false;
    }
    return true;
  });
  const independentDynamicsPair = independentPairs.map((independentPair) => {
    return { chars: independentPair, dynamicType: "independent" };
  });
  return independentDynamicsPair;
}

const calculateEpisodeAlternativity = (
  chars: string[],
  scenes: Scene[]
): DynamicPair[] => {
  const epChars = getCharacterSignatures(chars, scenes);
  console.log("epChars", epChars);
  const pairs = pair(epChars);
  console.log("pairs", pairs);
  const alternatePairs = pairs.filter((paired) => {
    const a = paired[0].scenes;
    const b = paired[1].scenes;
    return a.every((ae) => !b.some((be) => ae.title === be.title));
  });
  console.log("alternatePairs", alternatePairs);
  const alternatingDynamicsPair = alternatePairs.map((alternatePair) => {
    return { chars: alternatePair, dynamicType: "alternative" };
  });
  return alternatingDynamicsPair;
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
