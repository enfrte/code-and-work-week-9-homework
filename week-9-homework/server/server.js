const fs = require("fs");
const express = require('express');
const app = express();
const helpers = require("./server-helpers.js");
const writeToDb = helpers.writeToDb;
const readDb = helpers.readDb;
const port = process.env.PORT || 5000;
const db = "database.json";

// middleware
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// Home
app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/test', (req, res) => {
  res.send({ express: 'HELLO, WORLD!' });
});

// H9.1. Create a new user with POST
app.post("/bank/user", async (req, res) => {
	console.log("POST request init!");
  console.log("req.body:", req.body);

  let dbArray = await readDb();
  const userId = Date.now();
  const newObj = { 
    id: userId, 
    name: req.body.name, 
    account_balance: req.body.initialDeposit, 
    password: req.body.password 
  };
  //console.log(json);
  dbArray = [...dbArray, newObj];
  writeToDb(dbArray);

	res.send({userId: userId});
});

//H9.2. GET account balance
app.get("/bank/:user_id/balance", async (req, res) => {
	console.log("GET request init!");
  const dbArray = await readDb();
  const userId = parseInt(req.params.user_id);

  const account = dbArray.find((obj) => {
    return obj.id === userId;
  });
  
  if (account === undefined) {
    res.send(`User not found`);
    return; 
  }
	res.send({account_balance: account.account_balance});
});


// H9.3. Withdraw money with PATCH
app.patch("/bank/user/withdraw", async (req, res) => {
	console.log("Withdraw patch request init!");
	console.log("req.body:", req.body); 
	let existingData = [];
  let dbArray = await readDb();
  // copy of the db - get results that don't match (note, if there is only one user, then this will be empty)
  existingData = dbArray.filter((obj) => {
    return obj.id !== parseInt(req.body.id);
  });
  console.log("existingData", existingData);
  const userId = parseInt(req.body.id);
  // get the user object from the database
  let userObj = dbArray.find((obj) => {    
    return obj.id === userId && obj.password === req.body.password;
  });
  console.log("userObj", userObj);
  if (userObj === undefined) {
    res.send(`Error: Invalid credentials.`);
    return;
  }
  userObj.account_balance = userObj.account_balance - req.body.withdrawAmount;
  console.log("userObj", userObj);
  
  // add the updated result back to the database
  writeToDb([...existingData, userObj]);
	res.send({new_account_balance: userObj.account_balance});
});

//H9.4. Deposit money with PATCH
app.patch("/bank/user/deposit", async (req, res) => {
	console.log("Deposit PATCH request init!");
	console.log("req.body:", req.body); 
	let existingData = [];
  let dbArray = await readDb();
  // copy of the db - get results that don't match (note, if there is only one user, then this will be empty)
  existingData = dbArray.filter((obj) => {
    return obj.id !== parseInt(req.body.id);
  });
  //console.log("existingData", existingData);
  const userId = parseInt(req.body.id);
  // get the user object from the database
  let userObj = dbArray.find((obj) => {
    return obj.id === userId && obj.password === req.body.password;
  });
  console.log("userObj", userObj);
  if (userObj === undefined) {
    res.send(`Error: Invalid credentials.`);
    return;
  }
  userObj.account_balance = userObj.account_balance + req.body.depositAmount;
  //console.log("userObj", userObj);
  // add the updated result back to the database
  writeToDb([...existingData, userObj]);
	res.send({new_account_balance: userObj.account_balance});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
