import express from "express";
import session from "express-session";
import ejs from "ejs";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));


function getArticle(name) { 
  return articles[name]; 
}
function setArticle(name, content) { 
  articles[name] = content; 
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
  res.locals["articleslist"] = getKeys();
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const article = getArticle(req.body.articleName);

  if (!article) {
    return res.redirect("/");
  }

  req.session.message = {
    name: req.body.articleName,
    author: article.author,
    text: article.text
  };

  res.redirect("/article");
});

app.get("/article", (req, res) => {
  res.locals.article = req.session.message;
  delete req.session.message;
  res.render("article.ejs");
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/new", (req, res) => {
  console.log(req.body);
  setArticle(req.body.name, {author: req.body.author, text: req.body.text});
  save();
  res.redirect("/");
});

app.get("/edit", (req, res) => {
  res.locals.article = req.session.message;
  delete req.session.message;
  res.render("new.ejs");
});

app.post("/edit", (req, res) => {
  const article = getArticle(req.body.articleName);

   if (!article) {
    return res.redirect("/");
  }

  req.session.message = {
    name: req.body.articleName,
    author: article.author,
    text: article.text
  };

  res.redirect("/edit");
});

app.post("/delete", (req, res) => {
  const name = req.body.articleName;
  delete articles[name];
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
