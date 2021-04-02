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

app.get('/', (req, res) => {
  res.send('Hello from miniBazar')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dhhj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("miniBazar").collection("items");
  // console.log('db connected');
  
  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((result) => {
      // console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
      // res.redirect('/')
    });
    // console.log("adding new product", newOrder);
  });

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, products) => {
      // console.log(products);
      res.send(products);
    });
  });

  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    productCollection.insertOne(newOrder).
    then((result) => {
      console.log("inserted count", result);
      // res.send(result.insertedCount > 0);
      // res.redirect('/')
    });
  });

  app.get('/orders', (req, res) => {
    console.log(req.query.email);
    productCollection.find({email: req.query.email})
    .toArray((err, orders) => {
      console.log(orders);
      res.send(orders);
    });
  });

  app.get('/product/:productId', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.productId)})
    .toArray((err, products) => {
      // console.log(products);
      res.send(products[0]);
    });
  });
  app.get('/manageProducts', (req, res) => {
    productCollection.find()
    .toArray((err, manageProducts) => {
      // console.log(manageProducts);
      res.send(manageProducts);
    });
  });


  app.delete('/deleteProduct/:id', (req, res) => {
    const deleteProduct = {_id: ObjectId(req.params.id)}
    console.log(deleteProduct);
    productCollection.deleteOne(deleteProduct)
    .then(result => {
        // console.log(result);
        res.send(result.deletedCount > 0)
        // res.redirect('/manageProduct')
    })
})
  //   client.close();
});

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
