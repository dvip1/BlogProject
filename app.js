//jshint esversion:6
const lodash = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var arr = [];
const app = express();
const postLink = '/posts/:' + lodash.kebabCase("postname");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Starts here
databaseName = 'blogDB'
mongoose.connect('mongodb://127.0.0.1/' + databaseName);//for ipv4 connection
const blogScheme = new mongoose.Schema({
  Title: String,
  Content: String
});
const Blog = mongoose.model("Blog", blogScheme);
app.get('/', (req, res) => {

  Blog.find((err, blogs) => {
    if (err) console.log(`Found an error: ${err}`);
    else {
      arr = blogs;
    }
  })
  res.render('home', { homeStartingContent: homeStartingContent, arr: arr, lodash: lodash });
});

//get method
app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent });
});
app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent });
});
app.get('/compose', (req, res) => {
  res.render('compose');
});
app.get(postLink, (req, res) => {
  const requestedTitle = req.params.postname;
  let found = false;
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      if (lodash.kebabCase(arr[i].Title) === requestedTitle) {
        res.render('post', { title: arr[i].Title, content: arr[i].Content });
        found = true;
        break;
      }
    }
  }
  else if (!found) {
    res.render('post', { title: "Error 404", content: "Not found" })
  }
});
app.get('/admin', (req, res)=>{
  res.render('admin')
})

//post method
app.post('/compose', (req, res) => {
  const post = {
    Title: req.body.title,
    Content: req.body.content
  };
  const blog = new Blog({
    Title: req.body.title,
    Content: req.body.content
  });
  blog.save();
  arr.push(post);
  res.render('home', { homeStartingContent: homeStartingContent, arr: arr, lodash: lodash });
});
app.post('/admin', (req, res)=>{
  deleteTitle= req.body.title;
      Blog.find({ Title: deleteTitle}).remove().exec();
      res.redirect('/');
})
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
