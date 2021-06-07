const express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    socket = require('socket.io');


const app = express();
let http_server = http.createServer(app).listen(3132);

const io = socket(http_server)
io.on("connection", socket => {
    const currentUser = socket.handshake;
    console.log("a user connected!!");
    socket.on('disconnect', function (){
        console.log("a user disconnected!")
    })
});


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})

app.get('/robotic', (req, res) => {
    res.sendFile(__dirname+'/robotic.html')
})

app.get('/serebot', (req, res) => {
    res.sendFile(__dirname+'/serebot.html')
})



app.post('/router',(req,res) => {
    const {route_name, value} = req.body;
    io.emit("robotic.data",route_name+":"+value+"!")
    res.send("ok")
})
