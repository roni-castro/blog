var express             = require("express"),
    expressSanitizer    = require("express-sanitizer"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    app                 = express();
    
mongoose.connect("mongodb://localhost/blog_db", {useMongoClient: true}, function(err){
    if (err){
        throw err;
    } else{
        console.log('Mongo DB is connected');
    }
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var postSchema = new mongoose.Schema({
    title: String,
    body: String,
    photo: String,
    createAt: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog", postSchema);
    
app.get("/", function(req, res){
    res.redirect("/posts");
})

app.get("/posts", function(req, res){
   Blog.find({}, function(err, posts){
       if(err){
           console.log(err);
       } else{
           console.log(posts);
           res.render("posts", {posts: posts});
       }
    });
});

app.get("/posts/new", function(req, res){
    res.render("new");
});

app.get("/posts/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
       } else{
           console.log(post);
           res.render("edit", {post: post});
       }
    });
});

app.get("/posts/:id", function(req, res){
    Blog.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
       } else{
           console.log(post);
           res.render("postDetail", {post: post});
       }
    });
});

app.post("/posts", function(req, res){
     req.body.post.body = req.sanitize(req.body.post.body);
    var post = req.body.post;
    saveNewPostToDB(post);
    res.redirect("/posts");
});

app.put("/posts/:id", function(req, res){
    req.body.post.body = req.sanitize(req.body.post.body);
    var post = req.body.post;
    console.log("PUT");
    console.log(post);
     Blog.findByIdAndUpdate(req.params.id, post, function(err, updatedPost){
         if(err){
            console.log(err);
        } else {
            console.log("Post updated");
            console.log(updatedPost);
            res.redirect("/posts");
        }
    });
    
});

app.delete("/posts/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
         if(err){
            console.log(err);
        } else {
            console.log("Post updated");
            res.redirect("/posts");
        }
    });
});

app.get("*", function(req, res) {
    res.send("Route not found");
})
    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening");
});

function saveNewPostToDB(jsonValue){
    Blog.create(jsonValue, 
    function(err, post){
        if(err){
            console.log(err);
        } else {
            console.log("Post created");
            console.log(post);
        }
    });
}
    
    
    