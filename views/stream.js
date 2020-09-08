var socket = new WebSocket(`ws://localhost:3000`);
var livestream = document.getElementById("livestream");

socket.onopen = (e) => {
    console.log("Connected");
};

//get the user's webcam video and audio
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addVideoStream(livestream, stream);
    recordStream(stream);
}).catch((err) => {
    console.log("ERROR: ", err);
});

//set up the media recorder
function recordStream(stream) {
    var options = { mimeType: "video/webm" };
    var mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = sendVideoChunks;
    //IMPORTANT: Set the milliseconds to record at a time so that you have
    //data available every X milliseconds
    mediaRecorder.start(500);
}

//send the video chunks to the server
function sendVideoChunks(event) {
    console.log("Sending Chunk...");
    console.log(event.data);
    socket.send(event.data);
}

//add a video stream to the html document
function addVideoStream(video, stream) {
    video.srcObject = stream;
	console.log(stream);

    video.addEventListener("loadeddata", () => {
        video.play();
    });
}
