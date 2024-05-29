var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Datastore = require("nedb");
db = new Datastore({ filename: "users.db", autoload: true });
db.users.loadDatabase();

app.set("views", __dirname + "");
app.engine("html", require("ejs").renderFile);

app.get("/", function (req, res) {
  res.render("index.html");
});

app.post("/users-list", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var adress = req.body.adress;
  var user = { name: name, email: email, adress: adress };
  db.insert(doc, function (err, newuser) {
    if (err) {
      return res.send("error occur " + err);
    } else {
      return res.send("user save successfully");
    }
  });
});

app.get("/users-list", (req, res) => {
  db.find({}, function (err, users) {
    if (err) {
      return res.send("error occur " + err);
    } else {
      return res.send(users);
    }
  });
});

app.delete("/users/:id", (req, res) => {
  var userId = req.params.id;
  db.remove({ _id: userId }, {}, function (err, numRemoved) {
    if (err) {
      return res.status(500).send("Error occurred: " + err);
    } else {
      if (numRemoved === 0) {
        return res.status(404).send("User not found");
      } else {
        return res.send("User deleted successfully");
      }
    }
  });
});

app.put("/users/:id", (req, res) => {
  var userId = req.params.id;
  var updatedUser = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
  };
  db.update(
    { _id: userId },
    { $set: updatedUser },
    {},
    function (err, numReplaced) {
      if (err) {
        return res.status(500).send("Error occurred: " + err);
      } else {
        if (numReplaced === 0) {
          return res.status(404).send("User not found");
        } else {
          return res.send("User updated successfully");
        }
      }
    },
  );
});

app.listen(port);
