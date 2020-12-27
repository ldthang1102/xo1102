const express = require('express')
const hbs = require('hbs')
const app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')
app.use(express.static(__dirname + '/public'));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://xoxo1102:zz123321@cluster0.qrsco.mongodb.net/test';
app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ProductSystem");  
    let results = await dbo.collection("products").find({}).toArray();
    res.render('index',{model:results})
})
app.get('/insert',(req,res)=>{
    res.render('newProduct');
})
app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let sizeInput = req.body.txtSize;
    
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ProductSystem"); 
    let newProduct = {productName : nameInput, price:priceInput, color:colorInput,size: sizeInput};
    await dbo.collection("products").insertOne(newProduct);
   
    res.redirect('view');
})
app.get('/Edit',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductSystem");
    let result = await dbo.collection("products").findOne({"_id" : ObjectID(id)});
    res.render('edit',{model:result});
})
app.post('/doEdit',async (req,res)=>{
    let id= req.body.id;
    let name = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let sizeInput = req.body.txtSize;
    let newValues ={$set : {productName : name, price:priceInput, color:colorInput,size: sizeInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductSystem");
    await dbo.collection("products").updateOne(condition,newValues);
    
    res.redirect('view');
})
app.get('/delete', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductSystem");
    await dbo.collection('products').deleteOne(condition)
  +  res.redirect('view');
})
app.get('/view',async (req,res)=>{
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ProductSystem");  
    let results = await dbo.collection("products").find({}).toArray();
    res.render('viewProduct',{model:results})
})
app.get('/search',(req,res)=>{
    res.render('search')
})
app.post('/doSearch',async (req,res)=>{
    let nameInput = new RegExp(req.body.txtName);
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ProductSystem")    ;  
    let results = await dbo.collection("products").find({productName:nameInput}).toArray();
    res.render('viewProduct',{model:results})
})
app.get('/login',(req,res)=>{
    res.render('login')
})
var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!. . . ")