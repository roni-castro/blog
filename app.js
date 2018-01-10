var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();
    
mongoose.connect("mongodb://localhost/blog_db", {useMongoClient: true});
var db = mongoose.connection;

// When successfully connected
db.on('connected', function() {
    console.log('Mongo DB connection open for DB');
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    photo: String,
    createAt: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
    
app.get("/", function(req, res){
    res.redirect("/blog");
})

app.get("/blog", function(req, res){
   Blog.find({}, function(err, posts){
       if(err){
           console.log(err);
       } else{
           console.log(posts);
           res.render("blog", {posts: posts});
       }
    });
});

app.get("/blog/new", function(req, res){
    res.render("new");
});

app.get("/blog/edit", function(req, res){
    res.render("edit");
});

app.get("/blog/:id", function(req, res){
    res.render("blogDetail");
});

app.post("/blog", function(req, res){
    var blog = req.body.post;
    console.log(blog);
    saveNewPostToDB(blog);
     res.redirect("/blog");
});
    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening");
})

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
    
    
    