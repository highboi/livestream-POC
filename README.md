The javascript and the ejs files are located in the "views" directory.

This node project uses the "ws" module to recieve and send buffers of data which contain webm video.
The streamer uses the getUserMedia() method to get a data stream of the camera and microphone and the
MediaRecorder API to record and send the blobs of data to the server. The server.js file uses the "fs" module
to open a write stream to write and save the video data to a webm file. The server saves the data to an array
for those who join in late in the stream. If a client connects to the stream, then the server will send the saved
data in the data array as one Buffer object. After this, the client will recieve updates to their video as the streamer
sends the new Blobs of data. The client side (viewer of stream) uses MSE (Media Source Extensions) to show the video.
A new media source is created and a SourceBuffer is defined in order to add raw data to the media source for playing.
As the client recieves data from the server, more raw data will be appended to the SourceBuffer through the
SourceBuffer.appendBuffer() method which adds an ArrayBuffer or ArrayBufferView to the MediaSource.

Below are some of the things to research from the MDN Web Docs to understand how this all works:
- Media Source Extensions
- Media Source
- Source Buffer (Media Source)
- Media Recorder API
- Blob (data type)
- ArrayBuffer (data type)
- MediaDevices Interface
- Websockets

For the server side, research:
- ws module for websockets
- fs module write streams
