const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4040;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dhhj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("miniBazar").collection("items");
  
  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, products) => {
      res.send(products);
    });
  });

  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    productCollection.insertOne(newOrder).
    then((result) => {
      console.log("inserted count", result);
    });
  });

  app.get('/orders', (req, res) => {
    console.log(req.query.email);
    productCollection.find({email: req.query.email})
    .toArray((err, orders) => {
      res.send(orders);
    });
  });

  app.get('/product/:productId', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.productId)})
    .toArray((err, products) => {
      res.send(products[0]);
    });
  });
  app.get('/manageProducts', (req, res) => {
    productCollection.find()
    .toArray((err, manageProducts) => {
      res.send(manageProducts);
    });
  });


  app.delete('/deleteProduct/:id', (req, res) => {
    const deleteProduct = {_id: ObjectId(req.params.id)}
    console.log(deleteProduct);
    productCollection.deleteOne(deleteProduct)
    .then(result => {
        res.send(result.deletedCount > 0)
    })
})
  //   client.close();
});

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
