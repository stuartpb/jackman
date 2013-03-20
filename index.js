// I apologize in advance for subverting normal JS OOP practices the way I do.
// I'm basically improvising this entire thing.
var jackman = {};
var express = require("express");
var fs = require("fs");

//Recursive getter constructor for smooth config inheritance or fallthrough or
//defaulting or whatever.
function makeGetter(obj, cb) {
  return function(k){
    return (obj && Object.prototype.hasOwnProperty(k) && obj[k])
      || (cb ? cb(k) : undefined);
  };
}

//Function for traversing one of those routes where you specify parameters by
//putting colons through
//Params:
//- Path to traverse / recurse. Recursively calls the lesser bits of the path
//  as they come up, adding...
//- Getter for everything from the last dynamic component of the path.
//- Callback to call with everything once the end of the route/path is reached
//  and the filenames are coming up.
function routraverse(path,getta,cb){

}

jackman.posts = function(route){
  routraverse(route,makeGetter(this.config), function(path){
    
  });
};

jackman.configs = function(){

};

jackman.views = function(){

};

jackman.render = function(params, view){

};

jackman.route = function(route,view){
  this.app.get(route,function(req,res){
    res.render(req.params,view);
  });
};

function Jackman(config){
  this.app = express();
}

Jackman.prototype = jackman;

module.exports = function(config){
  return new Jackman(config);
};
