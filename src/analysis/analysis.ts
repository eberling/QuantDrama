import { Episode } from "src/analysis/interface-show";
import { Scene, EpisodeChar, DynamicPair } from "./interface-show";

const primaryChars = [
  "BASHIR",
  "SISKO",
  "KIRA",
  "ODO",
  "O'BRIEN",
  "QUARK",
  "DAX",
  "WORF",
  "JAKE",
  "COMPUTER",
  "NOG",
  "GARAK",
];

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
  if (!chars || !scenes) {
    return null;
  }
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
  if (!chars || !scenes) {
    return null;
  }
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
  const dominations: DynamicPair[] = [];
  pairs.forEach((paired) => {
    const a = paired[0].scenes;
    const b = paired[1].scenes;
    if (a.length > b.length) {
      const areDominant = b.every((bscene) =>
        a.some((ascene) => {
          const bool =
            ascene.title === bscene.title &&
            ascene.sceneNum === bscene.sceneNum;
          return bool;
        })
      );
      if (areDominant) {
        dominations.push({
          chars: [paired[0], paired[1]],
          dynamicType: "dominates",
        });
      }
    } else if (b.length > a.length) {
      if (
        a.every((ascene) =>
          b.some(
            (bscene) =>
              ascene.title === bscene.title &&
              ascene.sceneNum === bscene.sceneNum
          )
        )
      ) {
        dominations.push({
          chars: [paired[1], paired[0]],
          dynamicType: "dominates",
        });
      }
    }
  });
  return dominations;
}

function getCharacterSignatures(
  chars: string[],
  scenes: Scene[]
): EpisodeChar[] {
  if (!chars || !scenes) {
    return null;
  }
  const episodeChars = chars
    .map((char) => {
      let sceneTemp: Scene[] = [];
      scenes.forEach((scene) => {
        if (scene.chars.some((ch) => ch === char)) {
          sceneTemp.push(scene);
        }
      });
      const epChar: EpisodeChar = {
        name: char,
        scenes: sceneTemp,
      };
      return epChar;
    })
    .filter((epChar) => {
      return epChar.scenes.length > 0;
    }); // no nulls
  return episodeChars;
}

// weder konkomitant, noch dominant, speziallfall=> alternativ
function calculateEpisodeIndependence(chars: string[], scenes: Scene[]) {
  if (!chars || !scenes) {
    return null;
  }
  const domPairs = calculateEpisodeDominance(chars, scenes);
  const conPairs = calculateEpisodeConcomitance(chars, scenes);
  const altPairs = calculateEpisodeAlternativity(chars, scenes);
  const pairs = pair(getCharacterSignatures(chars, scenes));
  const independentPairs = pairs.filter((paired) => {
    const isDomPair = domPairs.some((domPair) => {
      const domPairCharNames = domPair.chars.map((char) => char.name);
      return paired.every((char) => domPairCharNames.includes(char.name));
    });
    const isConPair = conPairs.some((conPair) => {
      const conPairCharNames = conPair.chars.map((char) => char.name);
      return paired.every((char) => conPairCharNames.includes(char.name));
    });
    const isAltPair = altPairs.some((altPair) => {
      const altPairCharNames = altPair.chars.map((char) => char.name);
      return paired.every((char) => altPairCharNames.includes(char.name));
    });

    if (isAltPair || isConPair || isDomPair) {
      return false;
    }
    return true;
  });

  const independentDynamicsPair = independentPairs.map((independentPair) => {
    return { chars: independentPair, dynamicType: "independent" };
  });
  console.log(
    "calculateEpisodeIndependence -> independentDynamicsPair",
    independentDynamicsPair
  );
  return independentDynamicsPair;
}

const calculateEpisodeAlternativity = (
  chars: string[],
  scenes: Scene[]
): DynamicPair[] => {
  if (!chars || !scenes) {
    return null;
  }
  const epChars = getCharacterSignatures(chars, scenes);
  const pairs = pair(epChars);
  const alternatePairs = pairs.filter((paired) => {
    const a = paired[0].scenes;
    const b = paired[1].scenes;
    const noCommonScenes = a.every(
      (ae) =>
        !b.some((be) => ae.title === be.title && ae.sceneNum === be.sceneNum)
    );
    // const isComplementary = a.length + b.length === scenes.length;
    return noCommonScenes;
  });
  // console.log("alternatePairs", alternatePairs);
  const alternatingDynamicsPair = alternatePairs.map((alternatePair) => {
    return { chars: alternatePair, dynamicType: "alternative" };
  });
  return alternatingDynamicsPair;
};

const calculateJaccard = (chars, scenes) => {
  const epChars = getCharacterSignatures(chars, scenes);
  const paired = pair(epChars);
  const jaccards: {
    pair: EpisodeChar[];
    jaccard: number;
    sum: Set<Scene>;
    intersect: Scene[];
  }[] = paired
    .map((pair) => {
      const a = pair[0].scenes;
      const b = pair[1].scenes;
      // intersect is the number of scenes two characters have in common
      const intersect = a.filter((ascene) => {
        return b.some((bscene) => {
          return (
            ascene.title === bscene.title && ascene.sceneNum === bscene.sceneNum
          );
        });
      });
      // sum is the number of scenes both characters appear in
      const sum = new Set(a.concat(b));
      const jaccard = intersect.length / sum.size;
      return { pair: pair, jaccard: jaccard, sum: sum, intersect: intersect };
    })
    .filter((object) => object.jaccard > 0.7 && object.jaccard < 1);
  return jaccards;
};

function getAllDynamicsForEpisode(
  chars,
  scenes
): { chars: string[]; dynamicType: string }[] {
  const alts = calculateEpisodeAlternativity(chars, scenes);
  const doms = calculateEpisodeDominance(chars, scenes);
  const cons = calculateEpisodeConcomitance(chars, scenes);
  const all = alts.concat(doms, cons);

  // for later comparison between different seasons, scene needs to be removed
  const noScenes = all.map((dynPair) => {
    return {
      chars: [dynPair.chars[0].name, dynPair.chars[1].name],
      dynamicType: dynPair.dynamicType,
    };
  });
  return noScenes;
}

function sumAllDynamicsForSeason(episodes: Episode[]) {
  let countedDyns: Map<string, Episode[]> = new Map();
  episodes.map((episode) => {
    const episodeDyns = getAllDynamicsForEpisode(primaryChars, episode.scenes);
    episodeDyns.map((epDyn) => {
      const key = JSON.stringify(epDyn);
      if (countedDyns.has(key)) {
        countedDyns.get(key).push(episode);
      } else {
        countedDyns.set(key, [episode]);
      }
    });
  });
  // console.log("sumAllDynamicsForSeason -> countedDyns", countedDyns);
  return countedDyns;
}

function mergeAllDynamicsMaps(maps: Map<string, Episode[]>[]) {
  let merged: Map<string, Episode[]> = new Map();

  maps.forEach((map) => {
    map.forEach((value, key) => {
      if (!merged.has(key)) {
        merged.set(key, value);
      } else {
        const arr = merged.get(key).concat(value);
        merged.set(key, arr);
      }
    });
  });

  // console.log("mergeAllDynamicsMaps -> merged", merged);
  return merged;
}

const calculateHammingForSeason = (season: Episode[]) => {
  const hammingDistancesInSeason = season.map((episode) => {
    console.log(episode.episodeNum, episode.season);
    const hammingDistancesInEpisode = calculateHammingInEpisode(
      primaryChars,
      episode.scenes
    );
    return { episode, hammingDistancesInEpisode };
  });
  return hammingDistancesInSeason;
};

const calculateHammingInEpisode = (
  chars: string[] = primaryChars,
  scenes: Scene[]
) => {
  const epChars = getCharacterSignatures(chars, scenes);
  const paired = pair(epChars);
  const hammings: {
    pair: EpisodeChar[];
    hamming: number;
    totalLength: number;
    relativeHamming: number;
  }[] = paired.map((pair) => {
    const a = pair[0].name;
    const b = pair[1].name;

    let hamming = 0;

    scenes.forEach((scene) => {
      const aInScene = scene.chars.includes(a);
      const bInScene = scene.chars.includes(b);
      if (!(aInScene === bInScene)) {
        ++hamming;
      }
    });

    // console.log("calculateHamming -> hamming", hamming, pair, scenes);

    return {
      pair: pair,
      hamming: hamming,
      totalLength: scenes.length,
      relativeHamming: hamming / scenes.length,
    };
  });
  return hammings;
};

const calculateHammingForPair = (
  pair: string[] = primaryChars,
  scenes: Scene[]
): {
  pair: string[];
  hamming: number;
  totalLength: number;
  relativeHamming: number;
} => {
  const a = pair[0];
  const b = pair[1];

  let hamming = 0;

  scenes.forEach((scene) => {
    const aInScene = scene.chars.includes(a);
    const bInScene = scene.chars.includes(b);
    if (!(aInScene === bInScene)) {
      ++hamming;
    }
  });

  const hammingObject = {
    pair: pair,
    hamming: hamming,
    totalLength: scenes.length,
    relativeHamming: hamming / scenes.length,
  };

  return hammingObject;
};

function combineHammingWithTvShowDynamicsMap(
  map: Map<string, Episode[]>,
  hammings: {
    episode: Episode;
    hammingDistancesInEpisode: {
      pair: EpisodeChar[];
      hamming: number;
      totalLength: number;
      relativeHamming: number;
    }[];
  }[]
) {
  let finalArr: {
    pair: string[];
    dynamicType: string;
    episodesWithHamming: {
      episode: Episode;
      hammingObject: {
        hamming: number;
        relativeHamming: number;
      };
    }[];
    totalRelHamming: number;
    totalAbsHamming: number;
  }[] = [];

  map.forEach((values, key) => {
    // we are looking for frequent relationships that have a low relative hammingDistance;
    // Add the hammingDistance To The Relationship
    // Show the 50 most Frequent relationships. Sort them by lowest relative hamming distance;
    // mapelement: two chars, the type, and the episodes it occurs in. get those episodes,
    // generate hamming distances in those episodes between the characters of the key
    // => average hamming distance for two characters
    // => all the hamming distances added
    const keyObject: { chars: string[]; dynamicType: string } = JSON.parse(key);
    const pair = keyObject.chars;
    const dynamic = keyObject.dynamicType;
    const episodes = values;

    let absHammingOfAllEpisodes = 0;
    let relHammingOfAllEpisodes = 0;

    let tempAllRelHammingsAdded = 0;
    const episodesWithHamming = episodes.map((episode) => {
      const hammingObject = calculateHammingForPair(pair, episode.scenes);
      return {
        episode: episode,
        hammingObject: {
          hamming: hammingObject.hamming,
          relativeHamming: hammingObject.relativeHamming,
        },
      };
    });

    episodesWithHamming.forEach((episodeWithHamming) => {
      // console.log("episodeWithHamming", episodeWithHamming);
      absHammingOfAllEpisodes += episodeWithHamming.hammingObject.hamming;
      tempAllRelHammingsAdded +=
        episodeWithHamming.hammingObject.relativeHamming;
    });

    relHammingOfAllEpisodes =
      tempAllRelHammingsAdded / episodesWithHamming.length;
    finalArr.push({
      pair: pair,
      dynamicType: dynamic,
      episodesWithHamming: episodesWithHamming,
      totalAbsHamming: absHammingOfAllEpisodes,
      totalRelHamming: relHammingOfAllEpisodes,
    });
  });
  console.log("finalArr", finalArr);
  return finalArr;
}

export {
  combineHammingWithTvShowDynamicsMap,
  calculateHammingInEpisode,
  calculateHammingForSeason,
  mergeAllDynamicsMaps,
  sumAllDynamicsForSeason,
  calculateEpisodeAlternativity,
  // calculateComplementary,
  calculateEpisodeConcomitance,
  calculateEpisodeDominance,
  calculateEpisodeDensity,
  calculateEpisodeIndependence,
  calculateSceneDensity,
  filterCharsFromEpisode,
  getCharacterSignatures,
  calculateJaccard,
};
