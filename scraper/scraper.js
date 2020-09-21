const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
var serviceAccount = require("../quantdrama-firebase-adminsdk.json");

export const getEpisode = async (url) => {
  try {
    let episode = {
      title: null,
      episodeNum: null,
      season: null,
      chars: null,
      scenes: null,
    };
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const transcript = $("div font").text().replace("\n", " ");
    episode.title = $("body>p>font>b").text().replace("\n", " ");
    episode.chars = getChars(transcript);
    const dialogAndScenes = transcript.split(/(\[(?:(?!\[).)+\])(?!:)/g);
    dialogAndScenes.forEach((dialogOrScene) => {
      const elementIsScene = dialogOrScene.match(/^(\[.*\])$/g);
      if (elementIsScene) {
        if (!episode.scenes) {
          episode.scenes = new Array(); // new Episode
        }
        episode.scenes.push(new Scene(dialogOrScene)); // new Scene
      } else if (episode.scenes) {
        const lastAddedScene = episode.scenes.slice(-1)[0]; // last
        lastAddedScene.chars = getChars(dialogOrScene);
      } else {
        // no Scenes, must be intro
        console.log(element, "discarded");
      }
    });
    return episode;
  } catch (e) {
    console.log("[error building episode object:] ", e, url);
  }
};

const getChars = (text) => {
  // const nonUniqueChars = text.match(/(?![ .?!)\n])[^.:\n]+(?=:)/g);
  const nonUniqueChars = text.match(/([A-Z-']){3}.{0,25}(?=:)/g);
  if (!nonUniqueChars) {
    console.log("no Characters in Scene", text);
    return [];
  }
  const nonUniqueCharsCleaned = nonUniqueChars.map((character) => {
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
      return seasonUrls.map((url) => ({ season: season, url: url }));
    }
  } catch (e) {
    console.log("[error getting Links] ", e);
  }
};

// test getEpisode Function with an Episode from chakoteya

// const test = () => {
//   getEpisode("http://www.chakoteya.net/DS9/548.htm").then(
//     x =>
//       // console.dir(x, { depth: null })
//       x
//   );
// };
// test();
