const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("article", articleSchema);

/////////////////////// Request Targetting All Articles ///////////////////////////////////

app.route("/articles")

  // GET or READ or FETCH
  .get((req, res) => {
    Article.find((err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })

  // POST or CREATE
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save((err) => {
      if (!err) {
        res.send("Added Successfully");
      } else {
        res.send(err);
      }
    });
    console.log(req.body);
  })

  // DELETE or DELETE
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Deleted All Articles Successfully");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////// Request Targetting A Specific Article ///////////////////////////////////

  // GET or READ or FETCH

  app.route("/articles/:articleTitle")
    .get((req, res) => {
      Article.findOne({title: req.params.articleTitle}, (err, doc)=>{
        if(doc){
          res.send(doc);
        } else {
          res.send("No article matching that title found.");
        }
      });
    })

  // PUT or UPDATE - This http request is used when want to replace entire document.

    .put((req, res)=>{
      Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        // overwrite the entire document
        {overwrite: true},
        (err) => {
          if(!err){
            res.send("Article is update successfully.");;
          } else {
            res.send(err);
          }
        });
    })

    // PATCH or UPDATE Specific field - Use this http request when want to update only a specific feild.

    .patch((req, res)=>{
      console.log(req.body);
      Article.updateOne(
        {title: req.params.articleTitle},
        // this will set only properties parse by body parser
        {$set: req.body},
        (err) => {
          if(!err){
            res.send("Article is update successfully.");;
          } else {
            res.send(err);
          }
        });
    })

    // DELETE or DELETE

    .delete((req, res)=>{
      Article.deleteOne({title: req.params.articleTitle}, (err)=>{
        if(!err){
          res.send("Successfully deleted article");
        } else {
          res.send(err);
        }
      });
    });

app.listen(3000, () => {
  console.log("Server is running on port: 3000");
});
