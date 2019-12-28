// app.js
const express = require("express");
const app = express();

// MongoDB
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Redis
const redis = require("redis");
// const redisClient = redis.createClient(6379, "localhost");
const redisClient = redis.createClient(6379, "192.168.43.141");

const member1 = "192.168.43.141:1111";
const member2 = "192.168.43.198:2222";
const member3 = "192.168.43.76:3333";

//url
const url = `mongodb://${member1},${member2},${member3}/?replicaSet=rs1`;
// const url = `mongodb://localhost:27017`;

//db name
const dbName = "data_users";

//create a new mongoClient
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//connect to server
client.connect(err => {
  assert.equal(null, err);
  console.log("MongoDB : Connected correctly to server");
});

const db = client.db(dbName);

//collection
const col1 = db.collection("users_100");
const col2 = db.collection("users_1000");
const col3 = db.collection("users_10000");
const col4 = db.collection("users_100000");

// Endpoint
app.get("/", (req, res) => {
  res.json({
    Endpoint1: `MongoDB : /mongodb/100 or /mongodb/1000 or /mongodb/10000 or /mongodb/100000`,
    Endpoint2: `Redis : /redis/100 or /redis/1000 or /redis/10000 or /redis/100000`,
    Server: `2`
  });
});

// Endpoint MongoDB
app.get("/mongodb/100", (req, res) => {
  console.log("request was made: " + req.url);
  col1.find().toArray((err, docs) => {
    assert.equal(null, err);
    // console.log(docs);
    res.json(docs);
  });
});

app.get("/mongodb/1000", (req, res) => {
  console.log("request was made: " + req.url);
  col2.find().toArray((err, docs) => {
    assert.equal(null, err);
    // console.log(docs);
    res.json(docs);
  });
});

app.get("/mongodb/10000", (req, res) => {
  console.log("request was made: " + req.url);
  col3.find().toArray((err, docs) => {
    assert.equal(null, err);
    // console.log(docs);
    res.json(docs);
  });
});

app.get("/mongodb/100000", (req, res) => {
  console.log("request was made: " + req.url);
  col4.find().toArray((err, docs) => {
    assert.equal(null, err);
    // console.log(docs);
    res.json(docs);
  });
});

// Endpoint Redis
app.get("/redis/100", (req, res) => {
  console.log("\nNodeJS : request was made: " + req.url);
  redisClient.get("docs1", (err, reply) => {
    if (err) console.log(err);
    else if (reply !== null) {
      res.json(JSON.parse(reply));
      console.log("Redis : used data cache");
    } else {
      col1.find().toArray((err, docs) => {
        assert.equal(null, err);
        redisClient.set("docs1", JSON.stringify(docs), () => {
          redisClient.get("docs1", (err, reply) => {
            res.json(JSON.parse(reply));
          });
          console.log("Redis : data has been saved to cache");
        });
      });
    }
  });
});

app.get("/redis/1000", (req, res) => {
  console.log("\nNodeJS : request was made: " + req.url);
  redisClient.get("docs2", (err, reply) => {
    if (err) console.log(err);
    else if (reply !== null) {
      res.json(JSON.parse(reply));
      console.log("Redis : used data cache");
    } else {
      col2.find().toArray((err, docs) => {
        assert.equal(null, err);
        redisClient.set("docs2", JSON.stringify(docs), () => {
          redisClient.get("docs2", (err, reply) => {
            res.json(JSON.parse(reply));
          });
          console.log("Redis : data has been saved to cache");
        });
      });
    }
  });
});

app.get("/redis/10000", (req, res) => {
  console.log("\nNodeJS : request was made: " + req.url);
  redisClient.get("docs3", (err, reply) => {
    if (err) console.log(err);
    else if (reply !== null) {
      res.json(JSON.parse(reply));
      console.log("Redis : used data cache");
    } else {
      col3.find().toArray((err, docs) => {
        assert.equal(null, err);
        redisClient.set("docs3", JSON.stringify(docs), () => {
          redisClient.get("docs3", (err, reply) => {
            res.json(JSON.parse(reply));
          });
          console.log("Redis : data has been saved to cache");
        });
      });
    }
  });
});

app.get("/redis/100000", (req, res) => {
  console.log("\nNodeJS : request was made: " + req.url);
  redisClient.get("docs4", (err, reply) => {
    if (err) console.log(err);
    else if (reply !== null) {
      res.json(JSON.parse(reply));
      console.log("Redis : used data cache");
    } else {
      col4.find().toArray((err, docs) => {
        assert.equal(null, err);
        redisClient.set("docs4", JSON.stringify(docs), () => {
          redisClient.get("docs4", (err, reply) => {
            res.json(JSON.parse(reply));
          });
          console.log("Redis : data has been saved to cache");
        });
      });
    }
  });
});

// expired cache
const time = 60;
setTimeout(() => {
  redisClient.del("docs1");
  redisClient.del("docs2");
  redisClient.del("docs3");
  redisClient.del("docs4");
  console.log("Redis: has been expired");
}, time * 1000);

// Konfigurasi Web Server
const port = 80;
// ip address menyesuaikan
const ipaddress = "192.168.41.141";
app.listen(port, ipaddress);
console.log(`yo bro, server listening to port ${port}`);
