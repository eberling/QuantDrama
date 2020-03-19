const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
var serviceAccount = require("../quantdrama-firebase-adminsdk.json");

// episodes[Episode] => Episode{ title, characters[string] , scenes[Scene]} => Scene { title characters[string] }
// async function main() {
//   const seasonUrls = await getLinks(site + "episodes.htm", 1);
//   const episodes = await Promise.all(
//     seasonUrls.map((link, i) => {
//       return getEpisode(site + link);
//     })
//   );
//   console.dir(episodes, { depth: null });
// }

export const getEpisode = async url => {
  const episode = new Episode();
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const transcript = $("div font")
      .text()
      .replace("\n", " ");
    episode.title = $("body>p>font>b")
      .text()
      .replace("\n", " ");
    episode.chars = getChars(transcript);
    // console.log(transcript);
    const dialogAndScenes = transcript.split(/(\[(?:(?!\[).)+\])(?!:)/g);
    // console.log(dialogAndScenes);
    dialogAndScenes.forEach((dialogOrScene, i) => {
      const elementIsScene = dialogOrScene.match(/^(\[.*\])$/g);
      if (elementIsScene) {
        if (!episode.scenes) {
          episode.scenes = new Array(); // new Episode
        }
        episode.scenes.push(new Scene(dialogOrScene)); // new Scene
      } else if (episode.scenes) {
        const lastAddedScene = episode.scenes.slice(-1)[0];
        lastAddedScene.chars = getChars(dialogOrScene);
        // lastAddedScene.density =
        //   lastAddedScene.chars.length / episode.chars.length;
      } else {
        // no Scenes, must be intro
        // console.log(element, "discarded");
      }
    });
    console.log("return ", episode);
    return episode;
  } catch (e) {
    console.log("[error building episode object:] ", e, url);
  }
};

const getChars = text => {
  // const nonUniqueChars = text.match(/(?![ .?!)\n])[^.:\n]+(?=:)/g);
  const nonUniqueChars = text.match(/([A-Z-']){3}.{0,25}(?=:)/g);
  if (!nonUniqueChars) {
    console.log("no Characters in Scene", text);
    return [];
  }
  const nonUniqueCharsCleaned = nonUniqueChars.map(character => {
    // TODO; SPLIT CHAR + CHAR2 STRINGS
    return character.replace(/\[.*\]/, "").trim();
  });
  const deduped = new Set(nonUniqueCharsCleaned);
  const uniqueChars = [...deduped];
  return uniqueChars;
};

export const getLinks = async (url, season = 0) => {
  try {
    const html = await axios.get(url + "episodes.htm");
    const $ = cheerio.load(html.data);
    if (season === 0) {
      console.log("getting all seasons");
      links = $("table table a[href]")
        .map((i, e) => $(e).attr("href"))
        .get();
      return links;
    } else {
      console.log("getting season: ", season);
      const seasonUrls = $(
        `table tr:nth-child(${season * 2 + 1}) table a[href]`
      )
        .map((i, e) => $(e).attr("href"))
        .get();
      // console.log("seesy", seasonUrls);
      return seasonUrls.map(url => ({ season: season, url: url }));
    }
  } catch (e) {
    console.log("[error getting Links] ", e);
  }
};

// main();
// module.exports.Episode = Episode;
// module.exports.EpScene = EpScene;
// module.exports.getEpisode = getEpisode;
// module.exports.getLinks = getLinks;

// const test = () => {
//   getEpisode("http://www.chakoteya.net/DS9/548.htm").then(
//     x =>
//       // console.dir(x, { depth: null })
//       x
//   );
// };
// test();
