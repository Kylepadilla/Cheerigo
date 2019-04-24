
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");


var axios = require("axios");
var cheerio = require("cheerio");
// var db = require("./models");

var PORT = 3000;

var app = express();



// middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// connect mongo
mongoose.connect("mongodb://localhost/week18Populaterk");

// get route to scrape the echojs website
app.get("/scrape", (req,res)=> {
  axios.get("http://www.echojs.com/").then(response=> {

var $ = cheerio.load(response.data);

    $("article h2").each(function(i, element) {
      var result = {};


      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var save = new Article(result)

      save.save((err, doc)=>{
        if (err) {
            console.log(err);
          }
          else {
            console.log(doc);
          }
      })
    });

    res.send("Scrape Complete");
  });
});


app.get("/articles", (req,res)=> {
  Article.find({}).then(dbArticle=> {
      res.json(dbArticle);

    })
    .catch(err=> {

      res.json(err);
    });
});


app.get("/articles/:id", (req,res)=> {

  Article.findOne({ _id: req.params.id }).populate("note").then(dbArticle=> {
      res.json(dbArticle);
    }).catch(err=> {
      res.json(err);
    });
});

app.post("/articles/:id", (req,res)=> {

    var saveNote = new Note(req.body);
  
    saveNote.save((error, doc)=> {

      if (error) {
        console.log(error);
      }
      else {
        Article.findOneAndUpdate(
            {
                 "_id": req.params.id
             }, 
            { 
                "note": doc._id 
            }
            )
      }
    });
  });


app.listen(PORT, ()=> {
  console.log("App running on port " + PORT + "!");
});