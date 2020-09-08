var socket = new WebSocket(`ws://localhost:3000`);
var livestream = document.getElementById("livestream");

socket.onopen = (e) => {
    console.log("Connection Established");
};

socket.onmessage = async (event) => {
    console.log("Message from server:");

    var type = "video/webm; codecs=\"vp8, opus\"";
    var blobObj = new Blob([event.data], {'type': type});
    console.log(blobObj);

	var streamChunk = window.URL.createObjectURL(blobObj);
	livestream.src = streamChunk;
	livestream.addEventListener("canplay", () => {
		livestream.play();
	});
};

