const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
var admin = require("firebase-admin");
var serviceAccount = require("../firebase-admin-token.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quantdrama.firebaseio.com"
});

async function main() {
  const links = await getLinks(site + "episodes.htm");
  // const transcripts = Promise.all(
  //   links.map((link, i) => {
  //     return getTranscript(site + link);
  //   })
  // );

  const transcripts = await getTranscript(
    "http://www.chakoteya.net/DS9/432.htm"
  );

  //console.log(transcripts.text());
  //

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

const getTranscript = async url => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const transcriptNodes = $("div p font");
    console.log("important");
    const nonUniqueChars = transcriptNodes.text().match(/[A-Z][?'A-Z]+(?=:)/g);
    const dedupe = new Set(nonUniqueChars);
    const characters = [...dedupe];
    console.warn("# of Characters: ", characters.length);
    console.log(characters);
    console.log("\n");

    const episode = {
      epTitle: $("body>p>font>b").text(),
      epCharacters: characters,
      epScenes: []
    };

    const charsAndScenes = transcriptNodes.map((i, node) => {
      const $ = cheerio.load(node);
      // some episodes start with a "last time..." intro
      if (i === 0 && !$("b").text()) {
        console.log("strange", $("b").text(), i);
        console.log("Last time... discarded", $("*").text());
      } else if ($("b").text()) {
        return getScene(i, node);
      } else {
        return getSceneChars(node);
      }
    });
    console.log(charsAndScenes.get());
  } catch (e) {
    console.log("[error getting Transcripts] ", e);
  }
};

const getScene = (i, node) => {
  const $ = cheerio.load(node);
  const sceneTitle = $("b").text();
  if (sceneTitle) {
    console.log("New Scene!: ", sceneTitle);
    return sceneTitle;
    // epTranscript.epScenes.push({
    //   sceneTitle: sceneTitle,
    //   sceneChars: []
    // });
  } else {
    console.warn("Something went wrong - no Scene Name Found");
  }
};

const getSceneChars = node => {
  // let epScene = {
  //   sceneTitle: sceneTitle,
  //   sceneChars: []
  // }
  //       else if ((epTranscript.epScenes.slice(-1)[0].sceneChars)) {
  const $ = cheerio.load(node);
  const sceneDialog = $("*").text();
  const nonUniqueCharsInScene = sceneDialog.match(/[A-Z][?'A-Z]+(?=:)/g);
  const dedupe = new Set(nonUniqueCharsInScene);
  const uniqueCharsInScene = [...dedupe];
  console.log("Chars in Scene:", uniqueCharsInScene.slice(0, 30));
  return uniqueCharsInScene;
};

const getLinks = async url => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    links = $("table table a[href]")
      .map((i, e) => {
        return $(e).attr("href");
      })
      .get();
    return links;
  } catch (e) {
    console.log("[error getting Links] ", e);
  }
};

const db = admin.firestore();
// Required for side-effects
require("firebase/firestore");

// show > episode > scene >
// characters > scene
// get all episodes with scenes

// show > episode > script >

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
