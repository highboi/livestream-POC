//create a websocket and get the video tag for the live stream
var socket = new WebSocket(`ws://localhost:3000`);
var livestream = document.getElementById("livestream");

socket.onopen = (e) => {
    console.log("Connected");
};

//get the user's webcam video and audio
navigator.mediaDevices.getUserMedia({
    video: true, //we want video
    audio: true //we want audio
}).then((stream) => {
    addVideoStream(livestream, stream); //add the video stream to the document for display purposes
	recordStream(stream); //record the video stream in order to download it for later
}).catch((err) => {
    console.log("ERROR: ", err);
});

//set up the media recorder
function recordStream(stream) {
    var options = { mimeType: "video/webm" }; //set the mime type to webm
    var mediaRecorder = new MediaRecorder(stream, options); //make a new media recorder
    mediaRecorder.ondataavailable = sendVideoChunks; //send the video chunks to the server when data becomes available
    //IMPORTANT: Set the milliseconds to record at a time so that you have
    //data available every X milliseconds
    mediaRecorder.start(500); //make data available in X millisecond chunks
}

//send the video chunks to the server for downloading
async function sendVideoChunks(event) {
    console.log("Sending Chunk...");

	//make an array buffer from the blob data to send to the server
	var chunk = await event.data.arrayBuffer();
	var type = event.data.type.toString();

	//type (for debugging purposes)
	console.log(type);

	//send the data
	socket.send(chunk);
}

//add a video stream to the html document
function addVideoStream(video, stream) {
	//add the stream as the source of the video
    video.srcObject = stream;

	//whenever the video has loaded, play the video
    video.addEventListener("loadeddata", () => {
        video.play();
    });
}
