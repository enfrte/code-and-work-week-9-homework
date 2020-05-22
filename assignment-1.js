const fs = require("fs");
const readline = require("readline-sync");
// Creates writeStream.txt - Note! Will overwrite writeStream.txt if already exists 
//const stream = fs.createWriteStream("./writeStream.txt");
/*
stream.write("Hello, i am stream!", (err) => {
   if (err) console.log(err);
   else     console.log("success");
});
*/
let filename = readline.question("\nEnter a filename:\n");
filename = filename.trim();
//const myArgs = process.argv.slice(2); // returns an array of args 

const readStream = fs.createReadStream(filename, 'utf-8');

readStream.on("data", (txt) => {
	if (txt.includes("Suomi")) {
		console.log("TORILLE!");
	}
	if (txt.includes("fredag")) {
		console.log("Det är fredag mina bekanta");
	} 
});
