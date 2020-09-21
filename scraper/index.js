import "dotenv/config";
import * as scraper from "./scraper";
var admin = require("firebase-admin");
import config from "./../quantdrama-firebase-adminsdk.json";
admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://quantdrama.firebaseio.com",
});
const db = admin.firestore();

const site = "http://www.chakoteya.net/DS9/";

const main = async () => {
  const numbersOfSeasons = [...Array(1).keys()].map((x) => x + 1);
  const seasonUrls = await Promise.all(
    numbersOfSeasons.map((count) => {
      return scraper.getLinks(site, count);
    })
  );
  try {
    seasonUrls.map((seasonUrl) => {
      seasonUrl.map((links, i) => {
        scraper
          .getEpisode(site + links.url)
          .then((ep) => {
            let scenes = [];
            ep.scenes.map((scene, j) => {
              scenes.push({
                title: scene.title,
                chars: scene.chars,
                sceneNum: j + 1,
              });
            });
            const object = {
              title: ep.title,
              chars: ep.chars,
              scenes: scenes,
              season: links.season,
              episodeNum: i + 1,
            };
            console.dir(object, { depth: null });
            // commented out for safety reasons. This part pushes into the Firebase Database.
            // const docRef = db
            //   .collection(`season_${links.season}`)
            //   .doc()
            //   .create(object);
          })
          .catch((e) => console.log("error loading in DB", e));
      });
    });
  } catch (e) {
    console.error(e);
  }
};

main().then();
