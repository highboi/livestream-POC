const express = require("express");
const WebSocket = require("ws");
const fs = require("fs");
const uuid = require("uuid");

const app = express();

app.set("view engine", "ejs");

const server = require("http").createServer(app);

const wss = new WebSocket.Server({server});

app.use(express.static('views'));

var dataBuffer = [];

server.listen(3000);

//name and start a stream
app.get("/", (req, res) => {
	res.render("startstream.ejs");
});

//stream video
app.get("/l/stream", (req, res) => {
	var viewObj = {streamname: req.query.name};

	wss.on("connection", (ws) => {
		//create a writable stream to the mp4 file to save the live stream
		var writeStream = fs.createWriteStream("./stream.webm");

		ws.on("message", (message) => {
			if (typeof message == 'object') {
				//write the data to the video file
				writeStream.write(message, () => {
					console.log("Write Completed");
				});

				//add this data to the data buffer to send to others who join late in the stream
				dataBuffer.push(message);
			}

			//send the raw data to each of the live streaming clients
			wss.clients.forEach((item, index) => {
				if (item.readyState == WebSocket.OPEN && item != ws) {
					item.send(message);
				}
			});
		});

		//whenever the connection ends, clise the write stream to the file
		ws.on("close", () => {
			console.log("Connection Closed.");
			wss.clients.forEach((item, index) => {
				if (item.readyState == WebSocket.OPEN && item != ws) {
					item.send("ended");
				}
			});
			writeStream.end();
		});
	});

	res.render("stream.ejs", viewObj);
});

//view live streams
app.get("/l/view", (req, res) => {
	wss.on("connection", (ws) => {
		//send the existing data of the stream to the client on connection
		var dataBuf = Buffer.concat(dataBuffer);
		console.log(dataBuf);
		ws.send(dataBuf);

		ws.on("message", (message) => {
			if (message == 'ended') {
				console.log("Stream Ended");
			}
		});
	});

	res.render("viewstream.ejs");
});

