// matrix : episode.scenes.map(scene => {
//    scene.chars.map(char =>)
//  })

const calcEpisodeDensity = (chars, scenes) => {
  // episode density is average of all scene densities
  return (
    scenes.reduce(total, scene => total + calcSceneDensity(chars, scene)) /
    scenes.length
  );
};

const calcSceneDensity = (chars, scene) => {
  return chars.length / scene.chars.length;
};

const calcConcomitance = (chars, episode) => {};

const calcDominance = (chars, episode) => {};

const calcIndependence = (chars, episode) => {};

const calcAlternative = (chars, episode) => {};

const calcComplementary = (chars, episode) => {};

const calcScenicDistance = (chars, episode) => {};
