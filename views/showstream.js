var socket = new WebSocket(`ws://localhost:3000`); //websocket for recieving chunks
var livestream = document.getElementById("livestream"); //live stream video tag

var mediaSource = new MediaSource(); //global media source object
var sourceBuffer; //global var for the source buffer
var streamSrc = URL.createObjectURL(mediaSource); //object url for the stream
livestream.src = streamSrc; //set the source of the live stream

var finishedFillingChunks = false;
var pendingChunks = [];

//listen for the readyState change to "open" for the mediasource
mediaSource.addEventListener("sourceopen", sourceOpened);

//whenever the mediasource is opened, then add a source buffer
function sourceOpened() {
	/*
	IMPORTANT: Setting the Codecs correctly is key to playing the actual video. I set the codec to "opus" instead of "vorbis" and this caused
			   problems in the decoding.
	*/
	sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs=\"vorbis, vp8\"");

	console.log("Source is Open.");
}

//message that lets us know that the socket connected
socket.onopen = (e) => {
    console.log("Connection Established");
};

//append the bytes of video data
socket.onmessage = async (event) => {
    console.log("Message from server:");

	console.log(typeof event.data);
	console.log(event.data);

	var data = await event.data.arrayBuffer();

	if (typeof sourceBuffer != 'undefined' && mediaSource.readyState == "open") {
		console.log("APPENDING BUFFER:");
		sourceBuffer.appendBuffer(data);
	}
};
