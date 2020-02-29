const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
var serviceAccount = require("../quantdrama-firebase-adminsdk.json");

class Episode {
  epTitle;
  epChars;
  epScenes;
  constructor(epTitle, epChars, epScenes) {
    this.epTitle = epTitle;
    this.epChars = epChars;
    this.epScenes = epScenes;
  }
}
class EpScene {
  scTitle;
  scChars;
  constructor(scTitle, scChars) {
    this.scTitle = scTitle;
    this.scChars = scChars;
  }
}

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

const getSeason = async url => {};

const getEpisode = async url => {
  const episode = new Episode();
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    episode.epTitle = $("body>p>font>b")
      .text()
      .replace("\n", " ");
    const transcript = $("div font");
    const episodeCharacters = getChars(transcript.text());
    episode.epChars = episodeCharacters;
    const dialogAndScenes = transcript.text().split(/(\[(?:(?!\[).)+\])(?!:)/g);
    dialogAndScenes.forEach((element, i) => {
      const isScene = element.match(/^(\[.*\])$/g);
      if (isScene) {
        if (!episode.epScenes) {
          episode.epScenes = new Array();
        }
        episode.epScenes.push(new EpScene(element));
      } else if (episode.epScenes) {
        episode.epScenes.slice(-1)[0].scChars = getChars(element);
      } else {
        // console.log(element, "discarded");
      }
    });
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

const getLinks = async (url, season = 0) => {
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
      seasonUrls = $(`table tr:nth-child(${season * 2 + 1}) table a[href]`)
        .map((i, e) => $(e).attr("href"))
        .get();
      const boi = seasonUrls.map(url => {
        return { season: season, url: url };
      });
      return boi;
    }
  } catch (e) {
    console.log("[error getting Links] ", e);
  }
};

//main();
module.exports.Episode = Episode;
module.exports.EpScene = EpScene;
module.exports.getEpisode = getEpisode;
module.exports.getLinks = getLinks;
