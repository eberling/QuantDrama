const site = "http://www.chakoteya.net/DS9/";
const axios = require("axios");
const cheerio = require("cheerio");

async function main() {
  const links = await getLinks(site + "episodes.htm");
  const transcripts = await getTranscript(
    "http://www.chakoteya.net/DS9/414.htm"
  );
  //console.log(transcripts.text());
  transcripts.each((i, e) => {
    const $ = cheerio.load(e);
    const line = $.text();
    console.log($.text());
  });
}

const getTranscript = async url => {
  try {
    const html = await axios.get(url);
    return cheerio.load(html.data)("div p");
  } catch (e) {
    console.log("[error getting Transcripts] ", e);
  }
};

const getLinks = async url => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    return (links = $("table table a[href]")
      .map((i, e) => {
        return $(e).attr("href");
      })
      .get());
  } catch (e) {
    console.log("[error getting Links] ", e);
  }
};

main();
