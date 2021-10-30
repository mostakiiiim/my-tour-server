const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express()
const port = 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5zki0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('Database Connected');

        const database = client.db('myTour');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        // Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await ordersCollection.findOne(query);
            console.log('load orders with id', id);
            res.send(order)
        })

        //Post API

        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);


            console.log(result);
            res.json(result);
        })

        app.post('/orders', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service);
            const result = await ordersCollection.insertOne(service);


            console.log(result);
            res.json(result);
        })
        //UPDATE API

        // app.put('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('updating user', req);
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             status: updatedStatus.status
        //         },
        //     };
        //     const result = await ordersCollection.updateOne(filter, updateDoc, options)

        //     res.json(result)
        // })

        // Delete API

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})