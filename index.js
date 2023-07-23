const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());

// mongodb connect 

const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.xx7c7ta.mongodb.net/?retryWrites=true&w=majority`;
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
        const collegesCollection = client.db('campusDB').collection('colleges');
        const cartsCollection = client.db('campusDB').collection('carts');
        const usersCollection = client.db('campusDB').collection('users');
        //colleges api's
        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray();
            res.send(result);
        })
        //users api's
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const oldUser = await usersCollection.findOne(query);
            if (oldUser) {
                return res.send({ message: 'user already exists here!' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
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
    res.send("Campus Link server is running!")
})
app.listen(port, () => {
    console.log(`Campus Link server is running at port ${port}!`);
})

