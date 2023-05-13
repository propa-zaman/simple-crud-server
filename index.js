const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 9005;


// middleware
app.use(cors());
app.use(express.json());

// afrazaman17
//XXXX




const uri = "mongodb+srv://afrazaman17:XXXX@cluster0.4ffbuav.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db('usersDB').collection('users');

    // 2. Database theke server side e data show korano
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find()
      const result = await cursor.toArray();
      res.send(result);

    })

    // 1. client side theke databse e data pathano
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('new user', user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // 4. update data
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await usersCollection.updateOne(filter, updatedUser, options);
      res.send(result);
    })

    // 3. database theke delete kora
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const user = await usersCollection.findOne(query);
      res.send(user);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING')
})


app.listen((port), () => {
  console.log(`simple crud is running on port ${port}`)
})
