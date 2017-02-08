"use strict";

var fs = require("fs");

var words = require("./words.json");
var categories = require("./categories.json");

words.forEach(function(data) {
  data.Slug = data.Mot.replace(/ô/g, 'o');
  data.Slug = data.Slug.replace(/ü/g, 'u');
  data.Slug = data.Slug.replace(/ï|î/g, 'i');
  data.Slug = data.Slug.replace(/é|è|ê/g, 'e');
  data.Slug = data.Slug.replace(/à|â/g, 'a');
  data.Slug = data.Slug.replace(/ /g, '_');
  data.Slug = data.Slug.toLowerCase();

  var content = "---\n";
  content += "title: " + data.Mot + "\n";
  // TODO: slugify
  content += "permalink: " + data.Slug + ".html" + "\n";
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
  content += "examples:" + "\n";
  if(data.Exemple1) {
    content += "  - \"" + data.Exemple1.replace(/\r?\n/g, "").replace(/"/g, '\\"') + "\"\n";
  }
  if(data.Exemple2) {
    content += "  - \"" + data.Exemple2.replace(/\r?\n/g, "").replace(/"/g, '\\"') + "\"\n";
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

  fs.writeFileSync(__dirname + "/../_words/" + data.Slug + ".md", content);
});



// [{ "ID": "2", "Complique": "0", "Mot": "Diantre", "Lien": "http:\/\/blog.legardemots.fr\/post\/2006\/04\/10\/584-diantre", "Definition": "Mot exprimant l'\u00e9tonnement ou la consternation.", "Synonyme": "Diable, Fichtre", "Exemple1": "<strong>El\u00e8ve :<\/strong> Et l\u00e0 je d\u00e9rive...<br \/><strong>Prof<\/strong> : Diantre ! Pas encore !", "Exemple2": "Diantre ! Une pointe d'ostracisme envers un agent de la fonction publique\r\nhors de l'exercice de ses fonctions ? Cela risque de ne pas vous\r\nco\u00fbter grand-chose, si ce n'est quelque anath\u00e8me impr\u00e9catoire ab imo pectore !", "Date": "0000-00-00" }
