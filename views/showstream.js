var socket = new WebSocket(`ws://localhost:3000`); //websocket for recieving chunks
var livestream = document.getElementById("livestream"); //live stream video tag

var mediaSource = new MediaSource(); //global media source object
var sourceBuffer; //global var for the source buffer
var streamSrc = URL.createObjectURL(mediaSource); //object url for the stream
livestream.src = streamSrc; //set the source of the live stream

var timeSet = false;

//listen for the readyState change to "open" for the mediasource
mediaSource.addEventListener("sourceopen", sourceOpened);

//whenever the mediasource is opened, then add a source buffer
function sourceOpened() {
	/*
	IMPORTANT: Setting the Codecs correctly is key to playing the actual video. I set the codec to "opus" instead of "vorbis" and this caused
			   problems in the decoding.
	*/
	sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs=\"opus, vp8\"");
}

//function to update the seekable time of the video
function setTime() {
	//set the time to the latest seekable time
	livestream.currentTime = livestream.seekable.end(0);

	//if the video is playing, then set a timeout for 10 seconds to update the stream,
	//if the video is paused, then set a timeout for one second to constantly update the stream
	if (livestream.currentTime > 0 && !livestream.paused && !livestream.ended) {
		setTimeout(setTime, 10000);
	} else if (livestream.paused) {
		setTimeout(setTime, 1000);
	}
}

//message that lets us know that the socket connected
socket.onopen = (e) => {
    console.log("Connection Established");
};

//append the bytes of video data
socket.onmessage = async (event) => {
	//message to the developer
    console.log("Message from server:");
	console.log(typeof event.data);
	console.log(event.data);

	//set off the setTime function to update the livestream's seekable time
	if (timeSet == false && sourceBuffer.buffered.length != 0) {
		setTime();
		timeSet = true;
	}

	//if the data is an object (video data), then get the array buffer
	if (typeof event.data == 'object') {
		//get the data from the blob of video data
		var data = await event.data.arrayBuffer();

		//add the video data after performing some checks
		if (typeof sourceBuffer != 'undefined' && mediaSource.readyState == "open" && typeof data != 'undefined') { //if this is video data, then add it to the media source
			console.log("APPENDING BUFFER...");
			sourceBuffer.appendBuffer(data);
		}

		//increase the amount of time that the user can seek in the video as the video is recorded
		mediaSource.setLiveSeekableRange(livestream.seekable.start(0), livestream.seekable.end(0));
	} else if (typeof event.data == 'string') { //if the data sent to us is a string and not video data, then end the video stream/source
		if (event.data == "ended") {
			mediaSource.endOfStream();
		}
	}
};
