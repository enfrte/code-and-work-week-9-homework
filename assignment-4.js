const fs = require("fs");
const express = require("express");
const app = express();

// middleware
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// global vars
const PORT = 4444;
const db = "assignment-4.json";

const writeToDb = (newArray) => {
	const stream = fs.createWriteStream(db);
	stream.write(JSON.stringify(newArray), (err) => {
		if (err) console.log(err);
		else console.log("\nWritten to db\n");
	});
};

const readDb = () => {
	const readStream = fs.createReadStream(db, 'utf-8');
	readStream.on("data", (data) => {
		const json = JSON.parse(data);
		return json;
	});
};

// form for adding student
app.get('/student', (request, response) => {
	response.send(`
	<h3>Add student</h3>
	<form method="POST" action="/student">
		<p>Username</p>
		<input type="text" name="name"/>
		<p>Email</p>
		<input type="email" name="email"/>
		<button>Submit</button>
	</form>`);
});

app.get('/student/:id', (req, res) => {
	let result = [];
	const readStream = fs.createReadStream(db, 'utf-8');
	readStream.on("data", (data) => {
		let dbArray = JSON.parse(data);
		result = dbArray.filter((obj) => {
			return obj.id === parseInt(req.params.id);
		});
		if (result.length === 0) {
			res.send(`User not found`);
			return;
		}
		// PATCH form
		res.send(`
		<h3>Update student</h3>
		<form id="updateForm" name="updateForm" enctype="multipart/form-data">
		<input type="hidden" value="${result[0].id}" name="id"/>
		<p>Username</p>
			<input type="text" value="${result[0].name}" name="name"/>
			<p>Email</p>
			<input type="email" value="${result[0].email}" name="email"/>
			<button type="submit">Submit</button>
		</form>
		<script>
		let form = document.forms.namedItem("updateForm");

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			let formDataArray = new FormData(form);
			var object = {};
			formDataArray.forEach((value, key) => {object[key] = value});
			var json = JSON.stringify(object);
			fetch('/student/'+ object.id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: json
			});
		});
		</script>
		`);
	});
});

app.post("/student", (req, res) => {
	console.log("POST request init!");
	console.log("req.body:", req.body);
	const readStream = fs.createReadStream(db, 'utf-8');
	readStream.on("data", (data) => {
		let dbArray = JSON.parse(data);
		newObj = { id: Date.now(), name: req.body.name, email: req.body.email }
		//console.log(json);
		dbArray = [...dbArray, newObj];
		writeToDb(dbArray);
	});
	res.redirect("/student");
});

app.delete("/student/:id", (req, res) => {
	console.log("delete request init!");
	const readStream = fs.createReadStream(db, 'utf-8');
	readStream.on("data", (data) => {
		let dbArray = JSON.parse(data);
		const result = dbArray.filter((obj) => {
			return obj.id !== parseInt(req.params.id);
		});
		writeToDb(result);
	});
	res.redirect("/student");
})

// patch not working with the form
app.patch("/student/:id", (req, res) => {
	console.log("PATCH ---------------");
	console.log("req.body:", req.body);
	console.log("---------------------");
	let existingData = [];
	const readStream = fs.createReadStream(db, 'utf-8');
	readStream.on("data", (data) => {
		let dbArray = JSON.parse(data);
		// get results that don't match
		existingData = dbArray.filter((obj) => {
			return obj.id !== parseInt(req.body.id);
		});
		updatedObj = { id: parseInt(req.body.id), name: req.body.name, email: req.body.email }
		console.log("existingData", existingData);
		console.log("updatedObj", updatedObj);
		// add the updated result back to the database
		writeToDb([...existingData, updatedObj]);
	});
	//res.redirect("/student/" + req.body.id);
});
/*
// post acting like a patch
app.post("/student/:id", (req, res) => {
	console.log("POST request init!");
	console.log("req.body:", req.body);
	let existingData = [];
	const readStream = fs.createReadStream(db, 'utf-8');
	readStream.on("data", (data) => {
		let dbArray = JSON.parse(data);
		// get results that don't match
		existingData = dbArray.filter((obj) => {
			return obj.id !== parseInt(req.body.id);
		});
		updatedObj = { id: parseInt(req.body.id), name: req.body.name, email: req.body.email }
		console.log("existingData", existingData);
		console.log("updatedObj", updatedObj);
		// add the updated result back to the database
		writeToDb([...existingData, updatedObj]);
	});
	res.redirect("/student/" + req.body.id);
});
*/
app.listen(PORT, () => {
	console.log(`Listening to port ${PORT}`);
});  // Then connect to localhost:${PORT} with your browser

//response.send(``);