const express = require('express');

// Get express going
const app = express();

// setup ffmpeg
const fs = require('fs'), ffmpeg = require('fluent-ffmpeg')

var stream = fs.createWriteStream('stream.mov');

// input stream
const inputStream = ffmpeg('/dev/video0')
    .inputFormat('v4l2')
    .format('mov')
    .native()
    .outputOptions('-movflags frag_keyframe+empty_moov')
            .toFormat('mov')
        .preset('proxy')
        .output('output.mov')
    //.size('1920x1080')
    .on('end', function() {
        console.log('ended.');
    })
    .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .run();

// default route
app.get('/', function(req,res) {
    res.send('hello world');
});

// video route
app.get('/video/record', function(req,res) {
    var record = ffmpeg('stream.mov')
        .toFormat('mov')
        .preset('proxy')
        .output('output.mov')
        .on('error', function(err) {
            console.log('An error occurred2: ' + err.message);
        })
        .on('end', function() {
            console.log('Processing finished !');
        })
        .run();
});
        

app.listen(3000, function(){
    console.log('Server started on port 3000...')
});