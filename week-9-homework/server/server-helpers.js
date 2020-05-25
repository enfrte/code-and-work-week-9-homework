const fs = require("fs");
const db = "database.json";

const writeToDb = (newArray) => {
	const stream = fs.createWriteStream(db);
	stream.write(JSON.stringify(newArray), (err) => {
		if (err) console.log(err);
		else console.log("\nWritten to db\n");
	});
};

const readDb = async () => {
	const readStream = fs.createReadStream(db, 'utf-8');
	let promise = new Promise((resolve, reject) => {
		readStream.on("data", (data) => {	
			const json = JSON.parse(data);
			return resolve(json);
		});
	});
	let result = await promise;
	//console.log("readDb result", result); // this works
	return result;
};

module.exports.writeToDb = writeToDb;
module.exports.readDb = readDb;