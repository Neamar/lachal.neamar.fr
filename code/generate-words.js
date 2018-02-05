"use strict";

var fs = require("fs");

var words = require("./words.json");
var categories = require("./categories.json");
var examples = {};

function addExample(s, e) {
  var cleanedExample = e.trim().replace(/\n/g, " ").replace(/\r/g, "").replace(/\.\.\./g, "…").replace(/"/g, '""');
  if(!examples[cleanedExample]) {
    examples[cleanedExample] = [];
  }
  examples[cleanedExample].push(s);
}

words.forEach(function(data) {
  data.Slug = data.Mot.toLowerCase();
  data.Slug = data.Slug.replace(/ô/g, 'o');
  data.Slug = data.Slug.replace(/ü/g, 'u');
  data.Slug = data.Slug.replace(/ï|î/g, 'i');
  data.Slug = data.Slug.replace(/é|è|ê/g, 'e');
  data.Slug = data.Slug.replace(/à|â/g, 'a');
  data.Slug = data.Slug.replace(/ /g, '_');

  var content = "---\n";
  content += "title: " + data.Mot + "\n";
  // TODO: slugify
  content += "permalink: " + data.Slug + ".html" + "\n";
  content += "canonical: http://lachal.neamar.fr/" + data.Slug[0].toUpperCase() + data.Slug.substr(1) + "\n";
  content += "layout: word" + "\n";
  content += "categories:" + "\n";

  categories.filter((c) => c.Parent === data.ID).forEach(function(categorie) {
    content += "  - " + categorie.Categorie + "\n";
  });

  content += "synonyms:" + "\n";
  data.Synonyme.split(",").forEach(function(synonyme) {
    if(synonyme.indexOf(":") !== -1) {
      content += "  - \"" + synonyme.trim().replace(/"/g, '\\"') + "\"\n";
    }
    else {
      content += "  - " + synonyme.trim() + "\n";
    }
  });
  if(data.Exemple1) {
    addExample(data.Mot, data.Exemple1);
  }
  if(data.Exemple2) {
    addExample(data.Mot, data.Exemple2);
  }

  content += "link: " + data.Lien + "\n";
  content += "---" + "\n";
  content += "\n";
  var definition = data.Definition;
  definition = definition.replace(/\\i{([\s\S]+?)}/g, "*$1*");
  definition = definition.replace(/\\b{([\s\S]+?)}/g, "**$1**");
  definition = definition.replace(/\\item/g, "\n*");
  definition = definition.replace(/\\begin\{verse\}/g, ">");
  definition = definition.replace(/\\end\{verse\}/g, "");
  definition = definition.replace(/\\up\{(.+?)\}/g, "<sup>$1</sup>");
  definition = definition.replace(/\\date\{(.+?)\}/g, "$1");
  definition = definition.replace(/\\c\{(.+?)\}/g, "$1");
  definition = definition.replace(/\\small\{(.+?)\}/g, "<small>$1</small>");

  content += definition + "\n\n";

  // Windows linefeed: yerk
  content = content.replace(/\r/g, "");

  // ... => &hellip;
  content = content.replace(/\.\.\./g, "…");

  fs.writeFileSync(__dirname + "/../_words/" + data.Slug + ".md", content);
});

fs.writeFileSync(__dirname + "/../_data/examples.csv", "words,example\n" + Object.keys(examples).map((e) => `${examples[e].join("|").toLowerCase()},"${e}"`).sort().join("\n"));
