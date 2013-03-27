// I apologize in advance for subverting normal JS OOP practices the way I do.
// I'm basically improvising this entire thing.
var jackman = {};
var express = require("express");
var fs = require("fs");
var yaml = require("js-yaml");
var yamlhead = require("yamlhead");

//I'll figure out multi-markup-language transformation later.
var marked = require("marked");

//Function for traversing one of those routes where you specify parameters by
//putting colons in front of the path component, on the local filesystem.
//Params:
//- Path to traverse / recurse. Recursively calls the lesser bits of the path
//  as they come up, adding...
//- Object containing all params we've gathered.
//- Callback to switch to using for last component of the path (the files).
function routraverse(path,params,cb){

  // Find the first variable in the routey-path
  
  // If there is no variable and the path points at a file
  
    // Call the callback with the absolute path
  
  // If there is a variable
  
    // Get the file listings of the whole static path before that
    
    // For every path under that static path
    
    // If it conforms to the form of this dynamic component
    
      // Recurse, with the dynamic component replaced with the static
      //   name of this item

}

//I wanted to use this to make the equivalent jackman methods for each,
//but then JSHint was all "mep mep mep, use of `this` in a callback!"
//and I was all "oh screw this"
var bucketNames = ["posts","views","configs"];

function putForAllRoutes(routes,tree,node){
  routes.forEach(function(i,routeKeys){
    placeInTree(tree,routeKeys,node,0);
  });
}

jackman.posts = function(route){
  routraverse(route, this.config, function(path,params){
    var filename = path.slice(path.lastIndexOf('/')+1);
    params.format = params.format || filename.slice(path.lastIndexOf('.')+1);
    params.slug = params.slug || filename.substring(path.lastIndexOf('.'));
    var bucket = this.buckets.posts;
    var tree = this.trees.posts;
    var routeKeysBucket = this.buckets.routeKeys;
    yamlhead(path,function(err,head,body){
      if(err) throw err;
      
      //Merge params with yamlhead
      for(var param in head){
        params[param] = head[param];
      }
  
      var node = {params: params, leaf: {head: params, body: body}};
      //Put the post in the posts bucket
      bucket.push(node);
      //Put this post in the posts tree for any existing routes  
      putForAllRoutes(routeKeysBucket,tree,node);
    });
  });
};

jackman.configs = function(route){
  routraverse(route, this.config, function(path,params){
    //Configs can be either YAML or JSON.
    //Since JSON is a subset of YAML, we use the YAML loader for both.
    var config = yaml.load(
      fs.readFileSync(path,params.encoding||"utf8"),
      {filename: path});
    
    //Merge params with config
    for(var param in config){
      params[param] = config[param];
    }

    var node = {params: params, leaf: config};
    //Put the view in the posts bucket (having one leaf for each file may seem
    // kind of lame, but it ain't hurtin' nobody)
    this.buckets.views.push(node);
    //Put this post in the posts tree for any existing routes
    putForAllRoutes(this.buckets.routeKeys,this.trees.views,node);
    
    //Put the config in the configs bucket
    //Put this config in the configs tree for any existing routes
  });
};

jackman.views = function(route){
  routraverse(route, this.config, function(path,params){
    var filename = path.slice(path.lastIndexOf('/')+1);
    var lookups = {filename: path};

    //also add the path name without an extension
    //Note that this isn't really the Express-y way to do this
    lookups[filename.substring(0,filename.lastIndexOf('.'))] = path;

    var node = {params: params, leaf: lookups};
    //Put the view in the posts bucket (having one leaf for each file may seem
    // kind of lame, but it ain't hurtin' nobody)
    this.buckets.views.push(node);
    //Put this post in the posts tree for any existing routes
    putForAllRoutes(this.buckets.routeKeys,this.trees.views,node);
  });
};

function placeInTree(tree,keys,node,i){
  //If the object has a key for this route
  if(node.params[keys[i]]){
    if(!tree.branches[keys[i]]) {
      tree.branches[keys[i]] = {};
    }
    if(!tree.branches[keys[i]][node.params[keys[i]]]) {
      tree.branches[keys[i]][node.params[keys[i]]] = {
        branches: {},
        leaves: [],
      };
    }
    //If we're still going down the route
    if(i < keys.length-1){
      return placeInTree(tree.branches[keys[i]][node.params[keys[i]]],
        keys,node,i+1);
      //If we're at the last switch for this route
    } else {
      return tree.branches[keys[i]][node.params[keys[i]]]
        .leaves.push(node.leaf);
    }
  } //If the object doesn't have one of the route's keys, bail
}

function findInTree(tree,keys,params,i){
  var branch = tree.branches[keys[i]] &&
    tree.branches[keys[i]][params[keys[i]]];
  //If the object has a key for this route
  if(branch) {
    //If we're still going down the route
    if(i < keys.length-1){
      return findInTree(branch,keys,params,i+1);
      //If we're at the last switch for this route
    } else if(branch.leaves.length == 1){
      return branch.leaves[0];
    } else return null;
  //If there's no route for this parameter value, bail
  } else return null;
}

function gatherFromTree(tree,keys,params,i,layers){
  var branch = tree.branches[keys[i]] &&
    tree.branches[keys[i]][params[keys[i]]];
  //If the object has a key for this route
  if(branch) {
    layers = layers.concat(branch.leaves);
  }
  //If we're at the last switch for this route
  if(!branch || i >= keys.length-1){
  //merge all the objects
    var finalObject = {};
    for(var param in params){
      finalObject[param] = params[param];
    }
    layers.forEach(function(i,subconfig){
      for(var param in subconfig){
        finalObject[param] = subconfig[param];
      }
    });
    return finalObject;
  } else {
    return findInTree(branch,keys,params,i+1,layers);
  }
}

jackman.route = function(route,view){
  //Add all non-optional keys to a new bucket
  var routeKeys = route.match(/:\w+(?![\?\w])/g)
    .map(function(str){return str.slice(1)});

  //MEP MEP MEP, USE OF THIS IN CALLBACK FUNCTION
  var buckets = this.buckets;
  var trees = this.trees;
  var config = this.config;

  buckets.routeKeys.push(routeKeys);

  //populate trees for other buckets
  bucketNames.forEach(function(i,bucketName){
    buckets[bucketName].forEach(function(i,object){
      placeInTree(trees[bucketName],routeKeys,object,0);
    });
  });
  
  this.app.get(route,function(req,res,next){
    var post = findInTree(trees.posts,routeKeys,req.params,0);
    var views = gatherFromTree(trees.views,routeKeys,req.params,0,[]);
    var viewFile = views[view];

    //if there's a valid post for this route
    //(if we didn't find a valid view, we'll hand it off to Express)
    if(post){
    var locals = gatherFromTree(trees.configs,routeKeys,req.params,0,
      //I'm pretty sure I want config to be the base.
      [config]);
    for(var param in post.head){
      locals[param] = post.head[param];
    }
    
    //We're just assuming content is Markdown for now
    locals.content = marked(post.body);

    //It's at this junction one could check for published status on the
    //locals and call next(), if they were so inclined

    res.render(viewFile || view, locals);

    //if there's no valid post/view for this route
    } else next(); //pass it along (a 404 handler will catch it)
  });
};

function Jackman(config){
  this.app = express();
  this.config = config;
  this.buckets = {
    posts: [],
    views: [],
    configs: [],
    routeKeys: []
  };
  this.trees = {
    posts: {
      branches: {},
      leaves: []
    },
    views: {
      branches: {},
      leaves: []
    },
    configs: {
      branches: {},
      leaves: []
    }
  };
}

Jackman.prototype = jackman;

module.exports = function(config){
  return new Jackman(config);
};
