const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(process.env.DB_NAME);
const port = process.env.PORT || 4040;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dhhj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("miniBazar").collection("items");
  // console.log('db connected');
  // const product = {name: 'Chal', quantity: '1 kg', price: 60}

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, products) => {
      // console.log(products);
      res.send(products);
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

  app.post("/addProduct", (req, res) => {
    const newOrder = req.body;
    productCollection.insertOne(newOrder).then((result) => {
      // console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
    // console.log("adding new product", newOrder);
  });

  app.delete('/deleteProduct/:id', (req, res) => {
    const deleteProduct = {_id: ObjectId(req.params.id)}
    console.log(deleteProduct);
    productCollection.deleteOne(deleteProduct)
    .then(result => {
        console.log(result);
        // res.send(result.deletedCount > 0)
    })
})

  //   client.close();
});

app.get("/", (req, res) => {
  res.send("Hello miniBazar!");
});

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
