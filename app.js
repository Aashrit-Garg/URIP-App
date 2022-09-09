const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const Moralis = require("moralis-v1/node");

var app = express();
app.set('view engine', 'ejs');
var server = http.createServer(app);

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port

  console.log("Listening at http://localhost:%s", port)
});

const serverUrl = "https://2pvhwpe68x0o.usemoralis.com:2053/server";
const appId = "SJWMhR197cXd01lxRH5oBj20oELfm4ZlPrjMGzVA";
const masterKey = "bHQIUuIBsf5QuUwuF4HvHtKgCOCEaskcx2JZrK8U";

app.use(function (req, res, next) {
  res.set({
    // since there is no res.header class in Parse, we use the equivalent to set the response headers
    "Access-Control-Allow-Origin": "*/*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, X-Parse-Session-Token",
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Parse-Session-Token"
  );

  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './views')));

app.get("/", async function (req, res) {
  await Moralis.start({
    serverUrl: serverUrl,
    appId: appId,
    masterKey: masterKey,
  });
  Moralis.serverUrl = serverUrl;
  const queryARR = new Moralis.Query("Mints");
  queryARR.equalTo("urip", "All Rights Reserved");
  const resultsARR = await queryARR.find();
  const querySRR = new Moralis.Query("Mints");
  querySRR.equalTo("urip", "Some Rights Reserved");
  const resultsSRR = await querySRR.find();
  var items = [];
  for (let i = 0; i < resultsARR.length; i++) {
    const item = {
      tokenId: resultsARR[i].get("tokenId"),
      image: resultsARR[i].get("image"),
      urip: resultsARR[i].get("urip"),
    };
    items.push(item);
  }
  for (let i = 0; i < resultsSRR.length; i++) {
    const item = {
      tokenId: resultsSRR[i].get("tokenId"),
      image: resultsSRR[i].get("image"),
      urip: resultsSRR[i].get("urip"),
    };
    items.push(item);
  }
  console.log(items.length);
  res.render('index', { items: items });
});

app.get("/items", async function (req, res) {
  await Moralis.start({
    serverUrl: serverUrl,
    appId: appId,
    masterKey: masterKey,
  });
  if (req.query.id == null || req.query.id == -1) {
    if (req.query.user == null) {
        const queryARR = new Moralis.Query("Mints");
        queryARR.equalTo("urip", "All Rights Reserved");
        const resultsARR = await queryARR.find();
        const querySRR = new Moralis.Query("Mints");
        querySRR.equalTo("urip", "Some Rights Reserved");
        const resultsSRR = await querySRR.find();
        var items = [];
        for (let i = 0; i < resultsARR.length; i++) {
          const item = {
            tokenId: resultsARR[i].get("tokenId"),
            image: resultsARR[i].get("image"),
            urip: resultsARR[i].get("urip"),
          };
          items.push(item);
        }
        for (let i = 0; i < resultsSRR.length; i++) {
          const item = {
            tokenId: resultsSRR[i].get("tokenId"),
            image: resultsSRR[i].get("image"),
            urip: resultsSRR[i].get("urip"),
          };
          items.push(item);
        }
        console.log(items.length);
        res.render("collections", { items: items });
    } else {
      Moralis.serverUrl = serverUrl;
      const query = new Moralis.Query("Mints");
      query.equalTo("owner", req.query.user);
      const results = await query.find();
      var items = [];
      for (let i = 0; i < results.length; i++) {
        const item = {
          tokenId: results[i].get("tokenId"),
          image: results[i].get("image"),
          urip: results[i].get("urip"),
        };
        items.push(item);
      }

      // Do something with the returned Moralis.Object values
      // for (let i = 0; i < results.length; i++) {
      //     const object = results[i];
      //     alert(object.id + " - " + object.get("ownerName"));
      // }
      res.render("collections", { items: items });
    }
  } else {
    res.render("item", { id: req.query.id });
  }
});
