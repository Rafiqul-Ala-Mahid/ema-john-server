const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.tyz6hju.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
    try {
        const productsCollection = client.db('emaJohn').collection('products');
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            // console.log(page, size);
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count,products});
        })

        app.post("/productsByIds", async (req, res) => {
            const ids = req.body;
          const objectIds = ids.map((id) => new ObjectId(id));
          const query = { _id: { $in: objectIds } };
          const cursor = productsCollection.find(query);
          const products = await cursor.toArray();
          res.send(products);
        });
    }
    finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('successfully get it!');
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})