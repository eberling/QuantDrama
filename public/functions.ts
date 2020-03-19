// matrix : episode.scenes.map(scene => {
//    scene.chars.map(char =>)
//  })

//Chars can be specified , e.g. top 10 chars
import { Season, Episode, Scene, Char, EpisodeChar } from "./interface-show";

function filterIrrelevantCharsFromScene(filter: Char[], scene: Scene): Scene {
  let sceneCpy = { ...scene };
  console.dir(sceneCpy, { depth: null });
  sceneCpy.chars = sceneCpy.chars.filter(char => filter.includes(char));
  return sceneCpy;
}

const filterCharsFromEpisode = (filter, scenes) => {
  return scenes.map(scene => filterCharsFromScene(filter, scene));
};

const getCharacterSignature = (char, scenes) => {
  scenes.map();
};

//receives already filtered Scene
const calculateSceneDensity = (chars, scene) => {
  return scene.chars.length / chars.length;
};
const calculateEpisodeDensity = (chars, scenes) => {
  // episode density is average of all scene densities
  return (
    scenes.reduce(total, scene => total + calculateSceneDensity(chars, scene)) /
    scenes.length
  );
};

const calculateEpisodeConcomitance = (chars, scenes) => {
  const charsWithSignature = chars.map(char => {
    return {
      char,
      scenes: scenes.map(scene => {
        scene.chars.includes(char) ? scene.title : null;
      })
    };
  });
  return (concomitantPairs = findIdenticalCharSignature(charsWithSignature));
};

const findIdenticalCharSignature = charsWithSignature => {
  if (charsWithSignature.length < 2) {
    return [];
  }
  const firstChar = charsWithSignature[0];
  const restChars = charsWithSignature.slice(1);
  const concomitantPairs = restChars.map(char => {
    if (JSON.stringify(firstChar.scenes) == JSON.stringify(char.scenes)) {
      return firstChar;
    }
  });
  return concomitantPairs.concat(findIdenticalCharSignature(restChars));
};

const calculateEpisodeDominance = scenes => {
  const chars = getCharsWithSignatureFromEpisode(scenes);
  const chars = chars.map(char => {
    return {
      char: scenes.map(scene => {
        scene.chars.includes(char) ? scene.title : null;
      })
    };
  });
};

// returns [{char, ['SceneA', 'SceneB']],[char, ['SceneA', 'SceneB']],[char, ['SceneA', 'SceneB']]]
const getCharsWithSignatureFromEpisode = scenes => {
  const scenesOnlyWithChars = scenes.map(scene => scene.chars);
  const charsWithSignature = scenesOnlyWithChars.map(char => {
    return {
      char,
      scenes: scenes.map(scene => {
        scene.chars.includes(char) ? scene.title : null;
      })
    };
  });
  return charsWithSignature;
};

const findDominantPairs = chars => {
  const pairs = pair(chars);
  const dominations = pairs.map(pair => {
    if (pair[0].length === pair[1].length) {
      return;
    } else if (pair[0].length > pair[1].length) {
      if (pair[1].every(val => pair[0].includes(val))) {
        console.log(pair[1].char + " dominated by" + pair[0].char);
        return [pair[0], pair[1]];
      }
    } else {
      if (pair[0].every(val => pair[1].includes(val))) {
        console.log(pair[0].char + " dominated by" + pair[1].char);
        return [pair[1], pair[0]];
      }
    }
  });
};

const pair = chars => {
  if (chars.length < 2) {
    return [];
  }
  const first = chars[0];
  const rest = chars.slice(1);
  const pairs = rest.map(function(x) {
    return [first, x];
  });
  return pairs.concat(pairwise(rest));
};

const calculateIndependence = (chars, episode) => {};

const calculateAlternative = (chars, episode) => {};

const calculateComplementary = (chars, episode) => {};

const calculateScenicDistance = (chars, episode) => {};
