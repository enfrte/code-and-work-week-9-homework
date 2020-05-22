const fs = require("fs");
const express = require("express");

const app = express();
const PORT = 2222;

app.get('/counter/', (request, response) => {
	const counterDb = "assignment-2.db";

	const readStream = fs.createReadStream(counterDb, 'utf-8');
	let counter;

	readStream.on("data", (num) => {		
		counter = request.query.number ? parseInt(num) + parseInt(request.query.number) : counter = parseInt(num) + 1;
	
		const stream = fs.createWriteStream(counterDb);
		stream.write(String(counter), (err) => {
			if (err) console.log(err);
			else console.log("\nWritten to db\n");
		});
		response.send(`<h1>Couter is ${counter}</h1>`);
	});

});

app.listen(PORT, () => {
	console.log(`Listening to port ${PORT}`);
});  // Then connect to localhost:${PORT} with your browser

