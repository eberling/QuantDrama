// matrix : episode.scenes.map(scene => {
//    scene.chars.map(char =>)
//  })

//Chars can be specified , e.g. top 10 chars
const calcEpisodeDensity = (chars, scenes) => {
  // episode density is average of all scene densities
  return (
    scenes.reduce(total, scene => total + calcSceneDensity(chars, scene)) /
    scenes.length
  );
};

const filterChars = (filter, chars) => {
  return chars.filter(char => filter.includes(char));
};

const filterCharsinScene = (filter, scene) => {
  let sceneCpy = [...scene];
  console.dir(sceneCpy, { depth: null });
  sceneCpy.chars = filterChars(filter, sceneCpy.chars);
  return sceneCpy;
};

const calcSceneDensity = (chars, scene) => {
  const sceneChars = filterChars(chars, scene);
  return sceneChars.length / chars.length;
};

const calcEpisodeConcomitance = (chars, scenes) => {
  const scenesWithFilteredChars = scenes.map(scene =>
    filterCharsinScene(chars, scene)
  );
  const charsWithSignature = chars.map(char => {
    return {
      char,
      scenes: scenesWithFilteredChars.map(scene => {
        scene.chars.includes(char) ? scene.title : null;
      })
    };
  });
  return (concomitantPairs = findIdenticalCharSignature(charsWithSignature));
};

const findIdenticalCharSignature = charsWithSignature => {
  if (charsWithSignature.length < 2) {
    return;
  }
  const firstChar = charsWithSignature[0];
  const restChars = charsWithSignature.slice(1);
  const concomitantPair = restChars.map(char => {
    if (JSON.stringify(firstSig.scenes) == SON.stringify(char.scenes)) {
      return firstSig;
    }
  });
  return concomitantPair.concat(findIdenticalCharSignature(restChars));
};

const calcDominance = (chars, episode) => {};

const calcIndependence = (chars, episode) => {};

const calcAlternative = (chars, episode) => {};

const calcComplementary = (chars, episode) => {};

const calcScenicDistance = (chars, episode) => {};
