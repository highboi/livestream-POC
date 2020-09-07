var socket = new WebSocket(`ws://localhost:3000`);
var livestream = document.getElementById("livestream");

socket.onopen = (e) => {
    console.log("Connection Established");
};

socket.onmessage = async (event) => {
    console.log("Message from server:");

    var reader = event.data.stream().getReader();
    var rawData;

	//have tried by calling .arrayBuffer() and .text() methods on event.data and then creating a blob, but nothing works
    reader.read().then(({done, value}) => {
        rawData = value;

		//if the data is not a blank piece of video
        if (typeof rawData != 'undefined') {
            var type = "video/webm; codecs=\"vp8, opus\"";
            var blobObj = new Blob([rawData], {type: type});
            console.log(blobObj);

            var streamChunk = window.URL.createObjectURL(blobObj);
            console.log(streamChunk);
            livestream.src = streamChunk;

            window.URL.revokeObjectURL(blobObj);
        }
    });
};

