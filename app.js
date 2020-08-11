//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

//Connection to db
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Init Schema
const articleSchema = {
    title: String, 
    content: String
};

// Init collection
const Article = mongoose.model("article", articleSchema );

////// Requests Targetting All Articles ///////
app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, results){
            if(!err){
                res.send(results);
            }
            
        });
    })
    .post(function(req, res){
    
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added a new article");
            }
            else{
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all articles");
            }
            else{
                res.send(err);
            }
        });
    });

    ////// Requests Targetting A Specific Articles ///////

app.route("/articles/:articleName")
    .get(function(req, res){
        const articleTitle = req.params.articleName;
        Article.findOne({title: articleTitle}, function(err, result){
            if(result){
                res.send(result);
            } else {
                res.send("No articles matching that title was found");
            }
        });
    })
    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleName},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Successfully updated " + req.params.articleName);
                }
                else{ 
                    res.send(err);
                }
            });
    })
    .patch(function(req, res){
        Article.updateOne(
            {title:req.params.articleName},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated " + req.params.articleName);
                }
                else{
                    res.send(err);
                }
            });
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleName},
            function(err){
                if(!err){
                    res.send("Succesfully deleted " + req.params.articleName);
                }
                else{
                    res.send(err);
                }
            });
    });
    

app.listen(3000, function(){
    console.log("Server started on port 3000");
});