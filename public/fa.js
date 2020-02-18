const siteUrl = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");
var admin = require("firebase-admin");
var serviceAccount = require("../firebase-admin-token.json");

const getTranscript = async () => {
  try {
    const fullLink = "http://www.chakoteya.net/DS9/414.htm";
    const html = await axios.get(fullLink);
    const $ = cheerio.load(html.data);
    const transcript = $("div").text();
    const splitIntoScenes = transcript.split(/(\[.+\]\n)/g);
    console.log(splitIntoScenes);
  } catch (e) {
    console.log("[error getting Transcripts]", e);
  }
};
getTranscript();
