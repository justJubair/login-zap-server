require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json())
app.use(cors())





const uri = process.env.DB_URI

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
    
    // Database collections
    const usersCollection = client.db("loginZapDB").collection("users")
    const employeesCollection = client.db("loginZapDB").collection("employees")


    // POST; a users
    app.post("/users", async(req,res)=>{
        const user = req?.body;
        const result = await usersCollection.insertOne(user)
        res.send(result)
    })


    // GET;  employees
    app.get("/employees", async(req,res)=>{
        const result = await employeesCollection.find().toArray()
        res.send(result)
    })

    // GET; an employee
    app.get("/employee/:id", async(req,res)=>{
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id)}
        const result = await employeesCollection.findOne(query)
        res.send(result)
    })

    // POST; an employee
    app.post("/employees", async(req,res)=>{
        const employee = req?.body;
        const result = await employeesCollection.insertOne(employee)
        res.send(result)
    })

    // Delete; an employee
    app.delete("/employee/:id", async(req,res)=>{
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id)};
        const result = await employeesCollection.deleteOne(query);
        res.send(result)
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



app.get("/", (req,res)=>{
    res.send("Login zap server is running")
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})