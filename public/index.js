const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
var admin = require("firebase-admin");
var serviceAccount = require("../firebase-admin-token.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quantdrama.firebaseio.com"
});

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

async function main() {
  const links = await getLinks(site + "episodes.htm", 1);
  // const episodes = Promise.all(
  //   links.map((link, i) => {
  //     return getEpisode(site + link);
  //   })
  // );

  const episode = await getEpisode("http://www.chakoteya.net/DS9/447.htm");
  console.log(episode.epScenes);

  // require("fs").writeFile(
  //   "./obana2.json",
  //   JSON.stringify(transcripts.data),
  //   function(err) {
  //     if (err) {
  //       console.error("Crap happens");
  //     }
  //   }
  // );
}

const getEpisode = async url => {
  const episode = new Episode();
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    episode.epTitle = $("body>p>font>b").text();
    const transcript = $("div font");
    const nonUniqueChars = getChars(transcript.text());
    const dedupe = new Set(nonUniqueChars);
    episode.epChars = [...dedupe];
    const dialogAndScenes = transcript.text().split(/(\[(?:(?!\[).)+\])(?!:)/g);
    dialogAndScenes.forEach((element, i) => {
      const isScene = element.match(/^(\[.*\])$/g);
      if (isScene) {
        if (!episode.epScenes) {
          episode.epScenes = new Array();
        }
        episode.epScenes.push(new EpScene(element));
        //console.log("new Scene:", episode.epScenes.slice(-1)[0].scTitle);
      } else if (episode.epScenes) {
        episode.epScenes.slice(-1)[0].scChars = getChars(element);
        //console.log("Scene:", episode.epScenes.slice(-1)[0]);
      } else {
        console.log(element, "discarded");
      }
    });
    return episode;
  } catch (e) {
    console.log("[error building episode object:] ", e);
  }
};

const getChars = text => {
  const nonUniqueChars = text.match(/[A-Z][^a-z\n]+(?=:)/g);
  const nonUniqueCharsCleaned = nonUniqueChars.map(e =>
    e.replace(/\[.*\]/, "").trim()
  );
  const deduped = new Set(nonUniqueCharsCleaned);
  const uniqueChars = [...deduped];
  return uniqueChars;
};

const getLinks = async (url, season = 0) => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    if (season === 0) {
      console.log("getting all seasons");
      links = $("table table a[href]")
        .map((i, e) => $(e).attr("href"))
        .get();
      return links;
    } else {
      console.log("getting season: ", season);
      links = $(`table tr:nth-child(${season * 2 + 1}) table a[href]`)
        .map((i, e) => $(e).attr("href"))
        .get();
      return links;
    }
  } catch (e) {
    console.log("[error getting Links] ", e);
  }
};

const db = admin.firestore();
// Required for side-effects
require("firebase/firestore");

// let docRef = db.collection("users").doc("alovelace");
// let setAda = docRef.set({
//   first: "Ada",
//   last: "Lovelace",
//   born: 1815
// });

// let colRef = db.collection("users");

// let aTuringRef = db.collection("users").doc("aturing");
// let setAlan = aTuringRef.set({
//   first: "Alan",
//   middle: "Mathison",
//   last: "Turing",
//   born: 1912
// });

// db.collection("users")
//   .get()
//   .then(snapshot => {
//     snapshot.forEach(doc => {
//       console.log(doc.id, "=>", doc.data());
//     });
//   })
//   .catch(err => {
//     console.log("Error getting documents", err);
//   });

main();
