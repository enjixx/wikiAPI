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

app.listen(3000, function(){
    console.log("Server started on port 3000");
});