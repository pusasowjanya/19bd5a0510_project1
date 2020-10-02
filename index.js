
const express=require('express');
const app=express();
let server=require('./server');
let middleware=require('./middleware');

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbname="Hospital";
const dbname1="Ventilators";
let db
let db1
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    db1=client.db(dbname1);
    console.log(`CONNECTED DATABASE: ${url}`);
    console.log(`DATABASE : ${dbname}`);
})


app.get('/hospitaldetails', middleware.checkToken, function(req,res)
{
 console.log("Fetching data from Hospital collection");
   var data=db.collection('Hospital').find().toArray()
   .then(result => res.json(result)); 
});


app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
 console.log("Ventilator Information");
   var ventilatordetails=db1.collection('Ventilators').find().toArray()
   .then(result => res.json(result)); 
});

app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
var status=req.body.status;
console.log(status);
   var ventilatordetails=db1.collection('Ventilators').find({"status":status}).toArray()
   .then(result => res.json(result)); 
});

app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
  var name=req.query.name;
  console.log(name);
     var ventilatordetails=db1.collection('Ventilators').find({'name': new RegExp(name,'i')}).toArray()
     .then(result => res.json(result)); 
  });

  app.post('/searchhospital',middleware.checkToken,(req,res)=>{
    var name1=req.query.name;
    console.log(name1);
       var hospitaldetails=db.collection('Hospital').find({'name': new RegExp(name1,'i')}).toArray()
       .then(result => res.json(result)); 
    });

    app.put('/updateventilator',middleware.checkToken,(req,res)=>{
     var ventid={ventilatorId: req.body.ventilatorId };
      console.log(ventid);
      var newvalues={$set:{ status: req.body.status } };
      db1.collection('Ventilators').updateOne(ventid,newvalues,function(err,result){
        res.json("1 document updated");
        if(err) throw err;
      });
          
      });
      app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
        var hId=req.body.hId;
        var ventilatorId=req.body.ventilatorId;
        var status=req.body.status;
        var name=req.body.name;

        var item=
        {
          hId:hId,ventilatorId:ventilatorId,status:status,name:name

        };
        db1.collection('Ventilators').insertOne(item,function(err,result){
          res.json('Item inserted');
        });

      });

      app.delete('/delete',middleware.checkToken,(req,res)=>
      {
        var myquery=req.query.ventilatorId;
        console.log(myquery);

        var myquery1={ ventilatorId: myquery };
        db1.collection('Ventilators').deleteOne(myquery1,function(err,result)
      {
        res.json("1 document deleted");
        if(err) throw err;
        
      });
        
      });
      app.listen(1100);
    
  