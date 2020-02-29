const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
const scraper = require("./scraper");
const episode = scraper.Episode;
var admin = require("firebase-admin");
var serviceAccount = require("../quantdrama-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quantdrama.firebaseio.com"
});

const db = admin.firestore();
require("firebase/firestore");

const main = async () => {
  const numbersOfSeasons = [...Array(7).keys()].map(x => x + 1);
  const seasonUrls = await Promise.all(
    numbersOfSeasons.map(count => {
      return scraper.getLinks(site, count);
    })
  );
  try {
    seasonUrls.map(season => {
      season.map((links, i) => {
        scraper
          .getEpisode(site + links.url)
          .then(ep => {
            let sceneArr = [];
            ep.epScenes.map((epScene, j) => {
              sceneArr.push({
                title: epScene.scTitle,
                chars: epScene.scChars,
                sceneNum: j
              });
            });
            object = {
              title: ep.epTitle,
              chars: ep.epChars,
              scenes: sceneArr,
              season: links.season,
              episodeNum: i
            };
            const docRef = db
              .collection(`season_${links.season}`)
              .doc()
              .create(object);
          })
          .catch(e => console.log("error loading in DB", ep, e));
      });
    });
  } catch (e) {
    console.error(e);
  }
};

main().then();
