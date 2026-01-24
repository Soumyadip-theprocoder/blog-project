import express from "express";
import ejs from "ejs";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function getArticle(id) { 
  const article = articles[id];
  article.id = id;  
  return article; 
}
function setArticle(id, content) { 
  articles[id] = content; 
}
function getKeys() { 
  return Object.keys(articles); 
}


function load() {
  if (!fs.existsSync("articles.json")) return;

  const data = fs.readFileSync("articles.json", "utf8");
  articles = JSON.parse(data);
}
function save() {
  fs.writeFileSync(
    "articles.json",
    JSON.stringify(articles, null, 2),
    "utf8"
  );
  console.log("Articles saved!");
}


var articles ={};

load();


app.get("/", (req, res) => {
  res.locals.articleslist = getKeys();
  res.locals.articles=articles;
  res.render("index.ejs");
});

app.post("/", (req, res) => {
  res.redirect(`/article/${req.body.id}`);
});

app.get("/article/:id", (req, res) => {
  const article = getArticle(req.params.id);

  if (!article) {
    return res.redirect("/");
  }
  res.locals.article = article;
  res.render("article.ejs");
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/new", (req, res) => {
  console.log(req.body);
  const id = req.body.id || Date.now();
  setArticle(id, {title:req.body.title, author: req.body.author, text: req.body.text, createdAt: (new Date()).toDateString()});
  save();
  load();

  res.redirect(`/article/${id}`);
});

app.get("/edit/:id", (req, res) => {
  const article = getArticle(req.params.id);

  if (!article) {
    return res.redirect("/");
  }
  res.locals.article = article;
  res.render("new.ejs");
});

app.post("/edit", (req, res) => {
  res.redirect(`/edit/${req.body.id}`);
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  delete articles[id];
  save();
  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
