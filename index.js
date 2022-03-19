const PORT = process.env.PORT || 8000; // for deploying on heroku
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const news_source = [
  {
    name: "newsbitcoin",
    address: "https://news.bitcoin.com",
    base: "",
  },
  {
    name: "coindesk",
    address: "https://www.coindesk.com",
    base: "https://www.coindesk.com",
  },
  {
    name: "cryptopanic",
    address: "https://cryptopanic.com",
    base: "",
  },
  {
    name: "decrypto",
    address: "https://decrypt.co",
    base: "https://decrypto.co",
  },
  {
    name: "cointelegraph",
    address: "https://cointelegraph.com",
    base: "https://cointelegraph.com",
  },
  {
    name: "publish0x",
    address: "https://www.publish0x.com",
    base: "",
  },
  {
    name: "bitcoinist",
    address: "https://bitcoinist.com",
    base: "",
  },
  {
    name: "coincenter",
    address: "https://www.coincenter.org",
    base: "",
  },
  {
    name: "bitcoinmagazine",
    address: "https://bitcoinmagazine.com",
    base: "",
  },
  {
    name: "themerkle",
    address: "https://themerkle.com",
    base: "",
  },
  {
    name: "bitcoinwarrior",
    address: "https://bitcoinwarrior.net",
    base: "",
  },
  {
    name: "bitcoinwarrior",
    address: "https://bitcoinwarrior.net",
    base: "",
  },
  {
    name: "yahoofinance",
    address: "https://finance.yahoo.com/cryptocurrencies/",
    base: "",
  },
];

const articles = [];

const search = "crypto";

news_source.forEach((news_source) => {
  axios.get(news_source.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("a:contains(" + search + ")", html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: news_source.base + url,
        source: news_source.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to xCrypto API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:news_sourceID", (req, res) => {
  const news_sourceID = req.params.news_sourceID;

  const newsAddress = news_source.filter(
    (news_source) => news_source.name == news_sourceID
  )[0].address;
  const newsBase = news_source.filter(
    (news_source) => news_source.name == news_sourceID
  )[0].base;

  axios
    .get(newsAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $("a:contains(" + search + ")", html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newsBase + url,
          source: news_sourceID,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
