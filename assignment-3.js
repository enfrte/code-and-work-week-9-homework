const fs = require("fs");
const express = require("express");

const app = express();
const PORT = 3333;
const counterDb = "assignment-3.db";

const writeToDb = (newArray) => {
	const stream = fs.createWriteStream(counterDb);
	stream.write(JSON.stringify(newArray), (err) => {
		if (err) console.log(err);
		else console.log("\nWritten to db\n");
	});
};

app.get('/counter/:name', (request, response) => {
	//let counter;
	const readStream = fs.createReadStream(counterDb, 'utf-8');
	readStream.on("data", (data) => {		
		let personName; let updatedPersonCount; let newArray = [];
		let json = JSON.parse(data); 		
		//console.log("json", json);

		// First, check whether the person is in the db
		let person = json.filter((obj) => {
			return obj.name.toLowerCase() === request.params.name.toLowerCase()
		});
		// run different operations if the person is or isn't in the db
		if (person.length === 0) {
			// nobody by that name exists in the db - create new entry
			personName = request.params.name; // from the URL
			updatedPersonCount = 1;
			//console.log("New person:", personName, updatedPersonCount);
			newPersonObj = {name: personName, count: updatedPersonCount};
			json.push(newPersonObj); // add to the existing db
			//console.log("json", json);
			newArray = json; // used to overwrite the existing db
			//console.log("1 newArray", newArray);
		}
		else {
			// person alread exists - just update their count
			//console.log("Updating person:", person[0].name);
			personName = person[0].name;
			updatedPersonCount = parseInt(person[0].count) + 1;

			newArray = json.map(obj => {
				let returnObj = {...obj};
				if (obj.name.toLowerCase() === personName.toLowerCase()) {
					returnObj.count = updatedPersonCount;
				}
				return returnObj
			});
		}

		console.log("2 newArray", newArray);
		writeToDb(newArray);
		response.send(`<h1>${personName} : ${updatedPersonCount}</h1>`);
	});

});

app.listen(PORT, () => {
	console.log(`Listening to port ${PORT}`);
});  // Then connect to localhost:${PORT} with your browser

