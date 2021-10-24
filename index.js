const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json())


const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpne0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//   console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//user pass: igNnmrpWH8NMpWW8
//user name:genius-car-mecanics

//connect to the database

async function run() {
  try {
    await client.connect();
    const database = client.db("CarMechanics");
    const serviceCollection = database.collection("services");
      //get all api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result)
    })
    //get one api
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(service);
      // console.log(result);
      res.send(result);
    });
    //post api
    app.post('/services', async (req, res) => {
      const services = req.body;
      const result = await serviceCollection.insertOne(services);
      // console.log("hit the post body", result);
      res.json(result);
    })
    //put/ update api 
    app.put('/services/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          price: user.price,
          img:user.img,
        },
      };
        const result = await serviceCollection.updateOne(
          filter,
          updateDoc,
          options
        );
      console.log(result);
      res.send(result);
    })
    //delete api 
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) }
      const result = await serviceCollection.deleteOne(service);
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running!!!!!!");
})

app.listen(port, () => {
    console.log("Localhost server listening on port",port);
})