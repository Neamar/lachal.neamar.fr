"use strict";

var fs = require("fs");
var expressions = require("./expressions.json");

expressions = expressions.filter(function(expression) {
  if(!expression.Accepte) {
    return false;
  }
  if(expression.Is_Story) {
    return false;
  }

  return true;
});

