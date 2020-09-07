const express = require("express");
const WebSocket = require("ws");

const app = express();

app.set("view engine", "ejs");

const server = require("http").createServer(app);

const wss = new WebSocket.Server({server});

app.use(express.static('views'));

server.listen(3000);

//name and start a stream
app.get("/", (req, res) => {
	res.render("startstream.ejs");
});

//stream video
app.get("/l/stream", (req, res) => {
	var viewObj = {streamname: req.query.name};

	wss.on("connection", (ws) => {
		ws.on("message", (message) => {
			console.log("Video Chunk from Streamer, Sending to All Clients...");
			wss.clients.forEach((item, index) => {
				if (item.readyState == WebSocket.OPEN && item != ws) {
					item.send(message);
				}
			});
		});
	});

	res.render("stream.ejs", viewObj);
});

//view live streams
app.get("/l/view", (req, res) => {
	wss.on("connection", (ws) => {
		ws.on("message", (message) => {
			console.log("Sending Chunk to Client...");
			ws.send(message);
		});
	});

	res.render("viewstream.ejs");
});
