const http = require("http");

const server = http.createServer((req, res) => {
   res.write("Some cool response!");
   res.end();
});

const PORT = 2020;
console.log(`Listening port ${PORT}`);
server.listen(PORT);
